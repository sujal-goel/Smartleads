import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'sales']).optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'sales' },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerAuth(values);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        id="register-name"
        type="text"
        label="Full Name"
        placeholder="John Doe"
        leftIcon={<User className="h-4 w-4" />}
        error={errors.name?.message}
        autoComplete="name"
        {...register('name')}
      />
      <Input
        id="register-email"
        type="email"
        label="Email address"
        placeholder="you@example.com"
        leftIcon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        autoComplete="email"
        {...register('email')}
      />
      <Input
        id="register-password"
        type="password"
        label="Password"
        placeholder="Min. 6 characters"
        leftIcon={<Lock className="h-4 w-4" />}
        error={errors.password?.message}
        autoComplete="new-password"
        {...register('password')}
      />
      <Select
        id="register-role"
        label="Role"
        options={[
          { value: 'sales', label: 'Sales User' },
          { value: 'admin', label: 'Admin' },
        ]}
        error={errors.role?.message}
        {...register('role')}
      />
      <Button
        id="register-submit-btn"
        type="submit"
        className="w-full"
        size="lg"
        isLoading={isSubmitting}
        leftIcon={<UserPlus className="h-4 w-4" />}
      >
        Create Account
      </Button>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
};
