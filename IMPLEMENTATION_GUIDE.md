# Implementation Guide - Subscription Manager Pro

**Quick Reference voor Development**

---

## 🚀 Quick Start

```bash
# 1. Installeer dependencies
npm install

# 2. Kopieer environment variables
cp .env.example .env.local

# 3. Vul .env.local in met je Supabase credentials
# Je vindt deze in je Supabase dashboard: https://supabase.com/dashboard

# 4. Start de development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

---

## 📦 Environment Variables Setup

Open `.env.local` en vul in:

```env
# Supabase - VERPLICHT
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-service-role-key

# OAuth Providers - OPTIONEEL
# Configureer deze in Supabase Dashboard > Authentication > Providers

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret

# GitHub OAuth
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret
```

### Waar vind je deze keys?

**Supabase Keys:**
1. Ga naar https://supabase.com/dashboard
2. Selecteer je project
3. Ga naar Settings > API
4. Kopieer:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role (secret!) → `SUPABASE_SERVICE_ROLE_KEY`

**OAuth Keys:**
1. In Supabase Dashboard: Authentication > Providers
2. Enable Google/GitHub
3. Kopieer de Callback URL
4. Maak OAuth app aan bij Google/GitHub
5. Voeg credentials toe aan .env.local

---

## 🗄️ Database Setup

### Optie 1: Supabase Cloud (Aanbevolen)

```bash
# 1. Maak project aan op supabase.com
# 2. Run migrations via Supabase Dashboard
# - Ga naar SQL Editor
# - Kopieer inhoud van supabase/migrations/20240101000000_initial_schema.sql
# - Run query
# - Herhaal voor 20240101000001_rls_policies.sql
# - Herhaal voor 20240101000002_seed_data.sql

# Of gebruik Supabase CLI:
npx supabase link --project-ref your-project-ref
npx supabase db push
```

### Optie 2: Lokale Supabase (Voor development)

```bash
# Installeer Supabase CLI
npm install -g supabase

# Start lokale Supabase
npm run supabase:start

# Run migrations
npm run db:migrate

# Run seed
npm run db:seed
```

---

## 📁 Project Structure Explained

```
subscription-manager-pro/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── api/               # API routes (backend endpoints)
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages (TODO: Task 7)
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components
│   │   ├── auth/             # Auth-related components
│   │   ├── providers/        # Context providers
│   │   ├── ui/               # Basis UI components (TODO: Task 7)
│   │   ├── subscriptions/    # Subscription components (TODO: Task 7)
│   │   └── layout/           # Layout components (TODO: Task 7)
│   │
│   ├── lib/                   # Utilities & config
│   │   ├── supabase*.ts      # Supabase clients
│   │   ├── auth-helpers.ts   # Auth utilities
│   │   ├── utils.ts          # General utilities
│   │   └── validations/      # Zod schemas
│   │
│   ├── services/              # Business logic layer
│   │   ├── subscription.service.ts
│   │   ├── product.service.ts
│   │   ├── category.service.ts
│   │   └── analytics.service.ts
│   │
│   ├── types/                 # TypeScript types
│   │   ├── database.ts       # DB types
│   │   └── index.ts          # Common types
│   │
│   ├── hooks/                 # Custom React hooks (TODO: Task 8)
│   ├── config/                # App configuration
│   ├── middleware.ts          # Next.js middleware (i18n)
│   └── i18n.ts               # i18n config
│
├── public/
│   └── locales/              # Translation files
│       ├── en/               # English
│       ├── nl/               # Nederlands
│       ├── fr/               # Français
│       ├── de/               # Deutsch
│       ├── es/               # Español
│       └── it/               # Italiano
│
├── supabase/
│   ├── migrations/           # SQL migrations
│   ├── functions/            # Edge functions (TODO)
│   └── seed.ts              # Seed script
│
└── tests/                    # Test files (TODO: Task 9)
```

---

## 🔌 API Endpoints Reference

### Base URL
```
http://localhost:3000/api
```

### Authentication
Alle endpoints (behalve public ones) vereisen authentication via Supabase JWT token.

**Header:**
```
Authorization: Bearer <supabase-jwt-token>
```

---

### Subscriptions API

#### GET /api/subscriptions
Haal alle subscriptions op voor de ingelogde gebruiker.

**Query Parameters:**
- `status` (optional): "active" | "cancelled" | "paused" | "expired"
- `page` (optional): number, default 1
- `limit` (optional): number, default 20, max 100
- `sortBy` (optional): "created_at" | "next_billing_date" | "amount"
- `sortOrder` (optional): "asc" | "desc"

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "status": "active",
      "startDate": "2024-01-01",
      "nextBillingDate": "2024-02-01",
      "plan": {
        "name": "Premium",
        "product": {
          "name": "Netflix",
          "logoUrl": "https://...",
          "category": {
            "name": "Streaming Services",
            "color": "#E50914"
          }
        }
      },
      "price": {
        "amount": 15.99,
        "currency": "USD",
        "interval": "monthly"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42
  }
}
```

#### POST /api/subscriptions
Maak een nieuwe subscription aan.

**Request Body:**
```json
{
  "planId": "uuid",
  "priceId": "uuid",
  "startDate": "2024-01-01",  // optional
  "customAmount": 19.99,       // optional
  "customCurrency": "EUR",     // optional
  "notes": "Personal note"     // optional
}
```

**Response:** 201 Created
```json
{
  "data": { ...subscription }
}
```

#### GET /api/subscriptions/:id
Haal een enkele subscription op.

#### PUT /api/subscriptions/:id
Update een subscription.

**Request Body:**
```json
{
  "status": "cancelled",            // optional
  "endDate": "2024-12-31",         // optional
  "nextBillingDate": "2024-02-01", // optional
  "notes": "Updated note"          // optional
}
```

#### DELETE /api/subscriptions/:id
Verwijder een subscription.

---

### Products API

#### GET /api/products
Haal alle producten op met plans en prices.

**Query Parameters:**
- `categoryId` (optional): Filter by category UUID

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Netflix",
      "slug": "netflix",
      "description": {
        "en": "Watch TV shows and movies",
        "nl": "Bekijk tv-series en films"
      },
      "logoUrl": "https://...",
      "websiteUrl": "https://netflix.com",
      "category": {
        "name": "Streaming Services",
        "slug": "streaming",
        "color": "#E50914"
      },
      "plans": [
        {
          "id": "uuid",
          "name": "Premium",
          "description": "4K + HDR",
          "features": ["4K+HDR", "4 devices"],
          "prices": [
            {
              "id": "uuid",
              "amount": 19.99,
              "currency": "USD",
              "interval": "monthly",
              "isActive": true
            }
          ]
        }
      ]
    }
  ]
}
```

#### GET /api/products/:id
Haal een enkel product op (by ID or slug).

---

### Categories API

#### GET /api/categories
Haal alle categorieën op.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Streaming Services",
      "slug": "streaming",
      "icon": "🎬",
      "color": "#E50914"
    }
  ]
}
```

---

### Analytics API

#### GET /api/analytics/dashboard
Haal dashboard statistieken op voor ingelogde gebruiker.

**Response:**
```json
{
  "data": {
    "totalSubscriptions": 12,
    "activeSubscriptions": 8,
    "monthlySpending": 156.89,
    "yearlySpending": 1882.68,
    "upcomingRenewals": 3
  }
}
```

#### GET /api/analytics/spending?type=category
Haal spending breakdown per category.

**Response:**
```json
{
  "data": [
    {
      "name": "Streaming Services",
      "color": "#E50914",
      "amount": 45.99
    }
  ]
}
```

#### GET /api/analytics/spending?type=trend
Haal spending trend over tijd (12 maanden).

**Response:**
```json
{
  "data": [
    {
      "month": "2024-01",
      "amount": 142.50
    }
  ]
}
```

---

### Admin API (Requires admin/super_admin role)

#### POST /api/admin/products
Maak een nieuw product aan (admin only).

**Request Body:**
```json
{
  "name": "New Product",
  "slug": "new-product",
  "description": {
    "en": "Description"
  },
  "categoryId": "uuid",
  "logoUrl": "https://...",
  "websiteUrl": "https://...",
  "isActive": true
}
```

#### PUT /api/admin/products/:id
Update een product (admin only).

#### DELETE /api/admin/products/:id
Verwijder een product (admin only).

#### GET /api/admin/stats
Haal platform-wide statistieken op (admin only).

**Response:**
```json
{
  "data": {
    "totalUsers": 1250,
    "activeUsers": 980,
    "totalSubscriptions": 5420,
    "activeSubscriptions": 4100,
    "totalProducts": 156
  }
}
```

---

## 🎨 UI Components Guide (Task 7)

### Wanneer je de UI components gaat bouwen:

**1. Gebruik shadcn/ui als inspiratie**
- Tailwind CSS voor styling
- Radix UI voor accessible components
- Class Variance Authority voor variants

**2. Component Structure:**
```tsx
// src/components/ui/button.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

export { Button, buttonVariants };
```

**3. Feature Components:**
```tsx
// src/components/subscriptions/subscription-card.tsx
interface SubscriptionCardProps {
  subscription: SubscriptionWithDetails;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function SubscriptionCard({ subscription, onEdit, onDelete }: SubscriptionCardProps) {
  const { t } = useTranslations('subscriptions');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          {subscription.plan.product.logoUrl && (
            <img
              src={subscription.plan.product.logoUrl}
              alt={subscription.plan.product.name}
              className="h-12 w-12 rounded-md"
            />
          )}
          <div>
            <CardTitle>{subscription.plan.product.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {subscription.plan.name}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <PriceDisplay
          amount={subscription.price.amount}
          currency={subscription.price.currency}
          interval={subscription.price.interval}
        />
        <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
          {t(`status.${subscription.status}`)}
        </Badge>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" onClick={onEdit}>
          {t('edit')}
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          {t('delete')}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

---

## 🔗 TanStack Query Integration (Task 8)

### Setup

```tsx
// src/app/layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Custom Hooks

```tsx
// src/hooks/useSubscriptions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SubscriptionService } from '@/services/subscription.service';
import type { SubscriptionQuery } from '@/lib/validations/subscription';

export function useSubscriptions(query?: SubscriptionQuery) {
  const { data: user } = useAuth();

  return useQuery({
    queryKey: ['subscriptions', user?.id, query],
    queryFn: () => SubscriptionService.getUserSubscriptions(user!.id, query),
    enabled: !!user,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  const { data: user } = useAuth();

  return useMutation({
    mutationFn: (data: CreateSubscriptionInput) =>
      SubscriptionService.createSubscription(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  const { data: user } = useAuth();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubscriptionInput }) =>
      SubscriptionService.updateSubscription(id, user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  const { data: user } = useAuth();

  return useMutation({
    mutationFn: (id: string) =>
      SubscriptionService.deleteSubscription(id, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}
```

### Usage in Components

```tsx
// src/app/dashboard/subscriptions/page.tsx
export default function SubscriptionsPage() {
  const [query, setQuery] = useState<SubscriptionQuery>({});
  const { data, isLoading, error } = useSubscriptions(query);
  const deleteMutation = useDeleteSubscription();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await deleteMutation.mutateAsync(id);
      toast.success('Subscription deleted');
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <div>
      <h1>My Subscriptions</h1>
      <div className="grid gap-4">
        {data?.data.map((sub) => (
          <SubscriptionCard
            key={sub.id}
            subscription={sub}
            onDelete={() => handleDelete(sub.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 🧪 Testing Guide (Task 9)

### Unit Tests (Jest)

```tsx
// src/lib/__tests__/utils.test.ts
import { formatCurrency, formatDate } from '../utils';

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('formats USD correctly', () => {
      expect(formatCurrency(19.99, 'USD', 'en-US')).toBe('$19.99');
    });

    it('formats EUR correctly', () => {
      expect(formatCurrency(19.99, 'EUR', 'nl-NL')).toBe('€ 19,99');
    });
  });
});
```

### Component Tests

```tsx
// src/components/__tests__/SubscriptionCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SubscriptionCard } from '../subscriptions/subscription-card';

const mockSubscription = {
  id: '123',
  status: 'active',
  plan: {
    name: 'Premium',
    product: {
      name: 'Netflix',
      logoUrl: 'https://...',
    },
  },
  price: {
    amount: 19.99,
    currency: 'USD',
    interval: 'monthly',
  },
};

describe('SubscriptionCard', () => {
  it('renders subscription details', () => {
    render(<SubscriptionCard subscription={mockSubscription} />);
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('calls onDelete when delete button clicked', () => {
    const onDelete = jest.fn();
    render(<SubscriptionCard subscription={mockSubscription} onDelete={onDelete} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalled();
  });
});
```

### E2E Tests (Playwright)

```tsx
// tests/e2e/subscription-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Subscription Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signin');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('should create new subscription', async ({ page }) => {
    await page.goto('/subscriptions/new');
    await page.selectOption('[name="product"]', 'Netflix');
    await page.selectOption('[name="plan"]', 'Premium');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('**/subscriptions');
    await expect(page.getByText('Netflix')).toBeVisible();
  });
});
```

---

## 🌍 Multi-Language Support

### Adding New Translations

1. Open `public/locales/en/common.json`
2. Add your key:
```json
{
  "subscriptions": {
    "renewsIn": "Renews in {days} days"
  }
}
```

3. Add to all other languages (nl, fr, de, es, it)

### Using Translations

```tsx
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations('subscriptions');

  return <p>{t('renewsIn', { days: 5 })}</p>;
}
```

---

## 📝 Code Style Guide

### TypeScript
- Use `interface` for object shapes
- Use `type` for unions, primitives
- Avoid `any`, use `unknown` if needed
- Export types with your components

### Components
- Use function components
- Use TypeScript for props
- Destructure props
- Use named exports for components

### Naming
- Components: PascalCase (`SubscriptionCard`)
- Files: kebab-case (`subscription-card.tsx`)
- Functions: camelCase (`getUserSubscriptions`)
- Constants: UPPER_SNAKE_CASE (`MAX_SUBSCRIPTIONS`)

### File Organization
```
component-name/
├── index.ts              # Re-exports
├── component-name.tsx    # Main component
├── component-name.test.tsx
└── types.ts             # Component-specific types
```

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid hook call"
**Oorzaak:** Hook gebruikt buiten component of verkeerde React versie
**Oplossing:** Check dat je hooks alleen in components gebruikt

### Issue: "Hydration error"
**Oorzaak:** Server/client mismatch
**Oplossing:** Use `useEffect` voor client-only code, check timestamps

### Issue: "Module not found"
**Oorzaak:** Path alias niet geconfigureerd
**Oplossing:** Check tsconfig.json paths en restart dev server

### Issue: Supabase auth not working
**Oorzaak:** Missing environment variables of verkeerde callback URL
**Oplossing:**
1. Check .env.local
2. Check Supabase dashboard: Site URL en Redirect URLs
3. Restart dev server

---

## 💻 Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier
npm run type-check      # TypeScript type checking

# Database
npm run supabase:start  # Start local Supabase
npm run supabase:stop   # Stop local Supabase
npm run db:migrate      # Run migrations
npm run db:reset        # Reset database
npm run db:seed         # Run seed script

# Testing
npm run test            # Run Jest tests
npm run test:watch      # Jest watch mode
npm run test:coverage   # Coverage report
npm run test:e2e        # Run Playwright tests
```

---

**Laatst bijgewerkt:** 2025-11-23
