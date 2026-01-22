import { LocalizedStrings } from "@/src/i18n/localizedStrings";
import { z } from "zod";

export const signupBaseSchema = z.object({
  name: z.string().min(2, LocalizedStrings.VALIDATE.NAME.MIN_LENGTH),

  email: z
    .string()
    .min(1, LocalizedStrings.VALIDATE.EMAIL.REQUIRED)
    .email(LocalizedStrings.VALIDATE.EMAIL.INVALID),

  password: z.string().min(8, LocalizedStrings.VALIDATE.PASSWORD.MIN_LENGTH),

  confirmPassword: z
    .string()
    .min(1, LocalizedStrings.VALIDATE.CONFIRM_PASSWORD.REQUIRED),

  username: z
    .string()
    .min(3, LocalizedStrings.VALIDATE.USERNAME.MIN_LENGTH)
    .regex(/^[a-zA-Z0-9_]+$/, LocalizedStrings.VALIDATE.USERNAME.INVALID),

  birthday: z
    .date({
      error: LocalizedStrings.VALIDATE.BIRTHDAY.REQUIRED,
    })
    .refine((date) => {
      const today = new Date();
      const age =
        today.getFullYear() -
        date.getFullYear() -
        (today < new Date(today.getFullYear(), date.getMonth(), date.getDate())
          ? 1
          : 0);

      return age >= 13;
    }, LocalizedStrings.VALIDATE.BIRTHDAY.MIN_AGE),
});

export const signupSchema = signupBaseSchema.superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: LocalizedStrings.VALIDATE.CONFIRM_PASSWORD.NOT_MATCH,
    });
  }
});

export const verifyOtpSchema = z.object({
  otp: z.string().length(5, LocalizedStrings.VALIDATE.OTP.LENGTH),
});

export const loginSchema = signupBaseSchema.pick({
  email: true,
  password: true,
});

export const forgotPasswordSchema = signupBaseSchema.pick({
  email: true,
});

export const resetPasswordSchema = signupBaseSchema.pick({
  password: true,
  confirmPassword: true,
});
export type SignupFormValues = z.infer<typeof signupSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
