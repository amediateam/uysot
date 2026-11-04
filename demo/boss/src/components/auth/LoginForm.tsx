import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { loginSchema, userSchema, type LoginValues } from "@/services/auth/schemas";
import { http } from "@/services/http";
import { useAppDispatch } from "@/store";
import { changeToken } from "@/store/auth/slice";

export type LoginFormApi = UseFormReturn<LoginValues> & {
  mutation?: UseMutationResult<void, Error, LoginValues>;
};

interface LoginFormProps {
  children: (form: LoginFormApi) => ReactNode;
  defaultValues?: Partial<LoginValues>;
}

export const LoginForm = ({ children, defaultValues = {} }: LoginFormProps) => {
  const dispatch = useAppDispatch();
  const form: LoginFormApi = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { ...defaultValues },
  });

  const mutation = useMutation<void, Error, LoginValues>({
    mutationFn: async (values) => {
      const { data } = await http.request.post("/v1/auth/sign-in/dev", values);
      const user = userSchema.parse(data.data);
      dispatch(changeToken({ accessToken: user.accessToken, refreshToken: user.refreshToken }));
    },
  });

  const onSubmit = async (values: LoginValues) => {
    await new Promise((resolve) => mutation.mutate(values, { onSettled: resolve }));
  };

  console.log("mutation = ", mutation);
  form.mutation = mutation;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
      {children(form)}
    </form>
  );
};
