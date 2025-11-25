'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/spinner';
import { useProducts } from '@/hooks/useProducts';
import { useCreateSubscription } from '@/hooks/useCreateSubscription';

// Form validation schema
const formSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  planId: z.string().min(1, 'Plan is required'),
  priceId: z.string().min(1, 'Price is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

type FormData = z.infer<typeof formSchema>;

// Custom product form schema
const customProductSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  planName: z.string().min(1, 'Plan name is required').default('Standard'),
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.string().default('USD'),
  interval: z.enum(['monthly', 'yearly', 'weekly', 'quarterly']).default('monthly'),
});

type CustomProductFormData = z.infer<typeof customProductSchema>;

export function AddSubscriptionDialog() {
  const [open, setOpen] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  const { data: products, isLoading: productsLoading, refetch: refetchProducts } = useProducts();
  const createSubscription = useCreateSubscription();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: '',
      planId: '',
      priceId: '',
      notes: '',
    },
  });

  const {
    register: registerCustom,
    handleSubmit: handleSubmitCustom,
    reset: resetCustom,
    formState: { errors: customErrors },
  } = useForm<CustomProductFormData>({
    resolver: zodResolver(customProductSchema),
    defaultValues: {
      productName: '',
      planName: 'Standard',
      amount: 0,
      currency: 'USD',
      interval: 'monthly',
    },
  });

  // Watch form values for cascading dropdowns
  const selectedProductId = watch('productId');
  const selectedPlanId = watch('planId');

  // Filter plans based on selected product
  const availablePlans = useMemo(() => {
    if (!selectedProductId || !products) return [];
    const product = products.find((p) => p.id === selectedProductId);
    console.log('🔍 Selected Product:', product);
    console.log('🔍 Available Plans:', product?.plans);
    return product?.plans || [];
  }, [selectedProductId, products]);

  // Filter prices based on selected plan
  const availablePrices = useMemo(() => {
    if (!selectedPlanId || !availablePlans) return [];
    const plan = availablePlans.find((p: { id: string }) => p.id === selectedPlanId);
    console.log('🔍 Selected Plan:', plan);
    console.log('🔍 Available Prices:', plan?.prices);
    return plan?.prices || [];
  }, [selectedPlanId, availablePlans]);

  // Reset dependent fields when parent selection changes
  const handleProductChange = (value: string) => {
    setValue('productId', value);
    setValue('planId', '');
    setValue('priceId', '');
  };

  const handlePlanChange = (value: string) => {
    setValue('planId', value);
    setValue('priceId', '');
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createSubscription.mutateAsync({
        planId: data.planId,
        priceId: data.priceId,
        notes: data.notes || undefined,
      });
      reset();
      setOpen(false);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to create subscription:', error);
    }
  };

  const onSubmitCustom = async (data: CustomProductFormData) => {
    setIsCreatingCustom(true);
    try {
      // Create custom product with plan and price
      const response = await fetch('/api/products/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: data.productName,
          planName: data.planName,
          amount: data.amount,
          currency: data.currency,
          interval: data.interval,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create custom product');
      }

      const result = await response.json();

      // Refetch products to include the new custom product
      await refetchProducts();

      // Auto-select the newly created product, plan, and price
      setValue('productId', result.data.productId);
      setValue('planId', result.data.planId);
      setValue('priceId', result.data.priceId);

      // Switch back to main form
      setShowCustomForm(false);
      resetCustom();
    } catch (error) {
      console.error('Failed to create custom product:', error);
      alert('Failed to create custom product. Please try again.');
    } finally {
      setIsCreatingCustom(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {showCustomForm ? 'Create Custom Product' : 'Add New Subscription'}
          </DialogTitle>
          <DialogDescription>
            {showCustomForm
              ? 'Create a custom product for your personal subscription.'
              : 'Add a new subscription to track your spending.'}
          </DialogDescription>
        </DialogHeader>

        {productsLoading ? (
          <LoadingSpinner text="Loading products..." />
        ) : showCustomForm ? (
          <form onSubmit={handleSubmitCustom(onSubmitCustom)} className="space-y-4">
            {/* Back Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomForm(false)}
              className="gap-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to existing products
            </Button>

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                placeholder="e.g. My Local Gym"
                {...registerCustom('productName')}
              />
              {customErrors.productName && (
                <p className="text-sm text-destructive">{customErrors.productName.message}</p>
              )}
            </div>

            {/* Plan Name */}
            <div className="space-y-2">
              <Label htmlFor="planName">Plan Name</Label>
              <Input
                id="planName"
                placeholder="e.g. Standard, Premium"
                {...registerCustom('planName')}
              />
              {customErrors.planName && (
                <p className="text-sm text-destructive">{customErrors.planName.message}</p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...registerCustom('amount', { valueAsNumber: true })}
              />
              {customErrors.amount && (
                <p className="text-sm text-destructive">{customErrors.amount.message}</p>
              )}
            </div>

            {/* Currency and Interval */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <input type="hidden" {...registerCustom('currency')} />
                <Select defaultValue="USD" onValueChange={(value) => {
                  const event = { target: { name: 'currency', value } };
                  registerCustom('currency').onChange(event);
                }}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interval">Billing Interval</Label>
                <input type="hidden" {...registerCustom('interval')} />
                <Select defaultValue="monthly" onValueChange={(value) => {
                  const event = { target: { name: 'interval', value } };
                  registerCustom('interval').onChange(event);
                }}>
                  <SelectTrigger id="interval">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetCustom();
                  setShowCustomForm(false);
                }}
                disabled={isCreatingCustom}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingCustom}>
                {isCreatingCustom ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Product Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="product">Product *</Label>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setShowCustomForm(true)}
                  className="h-auto p-0 text-xs"
                >
                  + Create custom product
                </Button>
              </div>
              <Select value={selectedProductId} onValueChange={handleProductChange}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.productId && (
                <p className="text-sm text-destructive">{errors.productId.message}</p>
              )}
            </div>

            {/* Plan Selection */}
            <div className="space-y-2">
              <Label htmlFor="plan">Plan *</Label>
              <Select
                value={selectedPlanId}
                onValueChange={handlePlanChange}
                disabled={!selectedProductId || availablePlans.length === 0}
              >
                <SelectTrigger id="plan">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlans.map((plan: { id: string; name: string }) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.planId && (
                <p className="text-sm text-destructive">{errors.planId.message}</p>
              )}
            </div>

            {/* Price/Billing Interval Selection */}
            <div className="space-y-2">
              <Label htmlFor="price">Billing Interval *</Label>
              <Select
                value={watch('priceId')}
                onValueChange={(value) => setValue('priceId', value)}
                disabled={!selectedPlanId || availablePrices.length === 0}
              >
                <SelectTrigger id="price">
                  <SelectValue placeholder="Select billing interval" />
                </SelectTrigger>
                <SelectContent>
                  {availablePrices.map((price: { id: string; amount: number; currency: string; interval: 'weekly' | 'monthly' | 'quarterly' | 'yearly' }) => {
                    const intervalLabels: Record<string, string> = {
                      weekly: 'Week',
                      monthly: 'Month',
                      quarterly: 'Quarter',
                      yearly: 'Year',
                    };
                    const intervalLabel = intervalLabels[price.interval];

                    const formattedPrice = new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: price.currency,
                    }).format(price.amount);

                    return (
                      <SelectItem key={price.id} value={price.id}>
                        {formattedPrice} / {intervalLabel}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.priceId && (
                <p className="text-sm text-destructive">{errors.priceId.message}</p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <textarea
                id="notes"
                {...register('notes')}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Add any notes about this subscription..."
              />
              {errors.notes && (
                <p className="text-sm text-destructive">{errors.notes.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                disabled={createSubscription.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createSubscription.isPending}>
                {createSubscription.isPending ? 'Creating...' : 'Create Subscription'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
