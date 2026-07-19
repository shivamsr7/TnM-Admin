import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "../services/auth.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  loginSchema,
  type LoginSchema,
} from "../schemas/login.schema";
export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<LoginSchema>({
  resolver: zodResolver(loginSchema),
});

async function onSubmit(data: LoginSchema) {
  const { error } = await authService.login(
    data.email,
    data.password
  );

  if (error) {
    toast.error(error.message);
    return;
  }

  toast.success("Login successful!");

  navigate("/dashboard", { replace: true });
}

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 sm:space-y-5"
    >
      <div>


<Input
  type="email"
  placeholder="Enter your email"
  className="h-10 text-sm sm:h-11"
  disabled={isSubmitting}
  {...register("email")}
/>

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

  <div>


  {/* Password Input */}
  <div className="relative">
<Input
  type={showPassword ? "text" : "password"}
  placeholder="Enter your password"
  className="h-10 pr-10 text-sm sm:h-11"
  disabled={isSubmitting}
  {...register("password")}
/>

<button
  type="button"
  disabled={isSubmitting}
  onClick={() => setShowPassword((prev) => !prev)}
  className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-slate-500 transition-colors hover:text-black"
>
  {showPassword ? (
    <EyeOff className="h-4 w-4" />
  ) : (
    <Eye className="h-4 w-4" />
  )}
</button>
  </div>

  {errors.password && (
    <p className="mt-1 text-sm text-red-500">
      {errors.password.message}
    </p>
  )}

  {/* Remember Me & Forgot Password */}
  <div className="mt-3 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <Checkbox id="remember" />

    <label
      htmlFor="remember"
      className="cursor-pointer text-xs sm:text-sm"
    >
      Remember me
    </label>
  </div>

  <Link
    to="/forgot-password"
    className="text-xs text-primary hover:underline sm:text-sm"
  >
    Forgot password?
  </Link>
</div>
</div>

<Button
  type="submit"
  className="h-10 w-full text-sm sm:h-11"
  disabled={isSubmitting}
>
  {isSubmitting ? "Signing in..." : "Login"}
</Button>
    </form>
  );
}