import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
import { useForm } from "react-hook-form";
import { Icon } from "@/components/ui/Icon";
import { PasswordField, TextField } from "@/components/ui/form-fields";
import { useLogin } from "@/services/auth/hooks";
import { loginSchema, type LoginForm } from "@/services/auth/schema";
import { useAuth } from "@/store/auth";

// Login page (recovered from the build).
export const LoginPage = () => {
  const { setUser } = useAuth();
  const form = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const login = useLogin((user) => {
    setUser(user);
    form.reset();
  });

  const onSubmit = async (values: LoginForm) => {
    await new Promise<void>(() => login.mutate(values));
  };

  return (
    <section className="bg-primary-100 min-h-[100vh] flex items-center justify-center">
      <div className="bg-white p-[40px] rounded-[28px] w-[440px] ">
        <div className="flex flex-col items-center gap-[4px]">
          <Icon name="logo" className="mb-[22px]" />
          <h1 className="text-[24px]">Xush kelibsiz!</h1>
          <p className="text-[16px]">Iltimos hisob ma’lumotlarini kiriting</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col gap-[24px] mt-[24px]">
            <TextField control={form.control} size="large" name="username" placeholder="Login" />
            <PasswordField control={form.control} size="large" name="password" placeholder="Password" />
            <Button
              type="primary"
              htmlType="submit"
              className="w-[100%]"
              size="large"
              disabled={form.formState.isSubmitting}
              loading={form.formState.isSubmitting}
            >
              Kirish
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
