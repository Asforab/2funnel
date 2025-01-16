"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Role } from "@prisma/client";

const formSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(Role)
});

type FormData = z.infer<typeof formSchema>;

export function InviteForm({ agencyId }: { agencyId: string }) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: Role.AGENCY_ADMIN
    }
  });

  async function onSubmit(values: FormData) {
    try {
      const response = await fetch("/api/invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          agencyId
        })
      });

      if (!response.ok) {
        throw new Error("Failed to send invitation");
      }

      toast.success("Invitation sent successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to send invitation");
      console.error(error);
    }
  }

  return (
    <Form<FormData> form={form} onSubmit={onSubmit}>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email address" {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.email?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {Object.values(Role).map((role) => (
                    <option key={role} value={role}>
                      {role.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage>
                {form.formState.errors.role?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4">
          Send Invitation
        </Button>
      </div>
    </Form>
  );
}
