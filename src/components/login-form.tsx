import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const { login, signup } = useAuthStore((state) => state);
  const navigate = useNavigate();

  const [showNameField, setShowNameField] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const { name, email, password } = value;

      if (!showNameField) {
        await login(email, password);

        navigate({ to: "/" });
      } else {
        await signup(name, email, password);
        form.reset();
        setShowNameField(false);
      }
    },
  });
  return (
    <form
      className={cn("flex flex-col form", className)}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">به حساب خود وارد شوید</h1>
          <p className="text-muted-foreground text-sm text-balance">
            ایمیل و رمز عبور خود را وارد کنید .
          </p>
        </div>
        {/* Name field (shown only when registering) */}
        <AnimatePresence>
          {showNameField && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Field>
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) => (!value ? "نام خود را وارد کنید." : undefined),
                  }}
                >
                  {(field) => (
                    <Input
                      field={field}
                      type="text"
                      label={
                        <FieldLabel htmlFor="name" className="mb-2">
                          نام
                        </FieldLabel>
                      }
                    />
                  )}
                </form.Field>
              </Field>
            </motion.div>
          )}
        </AnimatePresence>
        <Field>
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "ایمیل را وارد کنید."
                  : !/^\S+@\S+\.\S+$/.test(value)
                    ? "ایمیل درست نمی باشد."
                    : undefined,
            }}
          >
            {(field) => (
              <Input
                field={field}
                type="email"
                label={
                  <FieldLabel htmlFor="email" className="mb-2">
                    ایمیل
                  </FieldLabel>
                }
              />
            )}
          </form.Field>
        </Field>
        <Field>
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                value.length < 6 ? "رمزعبور حداقل باید 6 کلمه باشد" : undefined,
            }}
          >
            {(field) => (
              <Input
                field={field}
                type="password"
                label={
                  <div className="flex justify-between mb-2">
                    <FieldLabel htmlFor="password">رمز ورود</FieldLabel>
                    <a href="#" className="text-sm underline-offset-4 hover:underline">
                      بازیابی رمز عبور ؟
                    </a>
                  </div>
                }
              />
            )}
          </form.Field>
        </Field>
        <Field>
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "درحال ورود..." : showNameField ? "ثبت نام" : "ورود"}
              </button>
            )}
          </form.Subscribe>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            {showNameField ? (
              <span>
                قبلاً اکانت دارید؟{" "}
                <a
                  href="#"
                  className="underline underline-offset-4 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowNameField(false);
                  }}
                >
                  ورود
                </a>
              </span>
            ) : (
              <span>
                آیا اکانت ندارید هنوز؟{" "}
                <a
                  href="#"
                  className="underline underline-offset-4 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowNameField(true);
                  }}
                >
                  ثبت نام
                </a>
              </span>
            )}
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
