#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.join(__dirname, '..');

class AgentsServer {
  constructor() {
    this.server = new Server(
      {
        name: 'agents-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_agents',
            description: 'List all available agent prompts',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'load_agent',
            description: 'Load a specific agent prompt by name',
            inputSchema: {
              type: 'object',
              properties: {
                agent_name: {
                  type: 'string',
                  description: 'The name of the agent to load (without .md extension)',
                },
              },
              required: ['agent_name'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        if (request.params.name === 'list_agents') {
          return await this.listAgents();
        } else if (request.params.name === 'load_agent') {
          return await this.loadAgent(request.params.arguments.agent_name);
        } else {
          throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async listAgents() {
    try {
      const files = fs.readdirSync(AGENTS_DIR);
      const agents = files
        .filter(file => file.endsWith('.md'))
        .map(file => file.replace('.md', ''));

      return {
        content: [
          {
            type: 'text',
            text: `Available agents:\n${agents.map((a, i) => `${i + 1}. ${a}`).join('\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to list agents: ${error.message}`);
    }
  }

  async loadAgent(agentName) {
    try {
      const filePath = path.join(AGENTS_DIR, `${agentName}.md`);
      
      if (!fs.existsSync(filePath)) {
        throw new Error(`Agent '${agentName}' not found`);
      }

      const content = fs.readFileSync(filePath, 'utf-8');

      return {
        content: [
          {
            type: 'text',
            text: `Agent: ${agentName}\n\n${content}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to load agent: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Agents MCP server running on stdio');
  }
}

const server = new AgentsServer();
server.run().catch(console.error);
