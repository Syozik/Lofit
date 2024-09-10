"use client";

import * as z from "zod";
import {useForm} from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/index";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import styles from "@/ui/page.module.css";
import { CardWrapper } from "./card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

export const LoginForm = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isPending, setPending] = useState(false);
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    
    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess(""); 
        setPending(true);
        await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        }).then((res) => res.json()
        ).then((data) => {
            setSuccess(data.message);
            setError(data.error);
        }).catch((err) => {
            console.log(err.error);
        }).finally(() => {
            setPending(false);
        });
    }

    return (
    <CardWrapper 
        headerLabel = "Welcome back!" 
        backButtonLabel = "Dont have an account?" 
        backButtonHref = "/signup" 
        showSocial>
        <Form {...form} >
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className = "space-y-6"
            >
               <div className="space-y-4" >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className={styles.formGroup}>
                                <FormControl className={styles.formControl}>
                                    <Input 
                                        {...field} 
                                        disabled={isPending}
                                        type="email"
                                    />
                                </FormControl>
                                <FormLabel className={styles.formLabel}>Email</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className={styles.formGroup}>
                                <FormControl className={styles.formControl}>
                                    <Input 
                                        {...field} 
                                        disabled={isPending}
                                        type="password"
                                    />
                                </FormControl>
                                <FormLabel className={styles.formLabel}>Password</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button type="submit" className="w-full" disabled={isPending}>Login</Button>
            </form>
        </Form>
    </CardWrapper>);
}