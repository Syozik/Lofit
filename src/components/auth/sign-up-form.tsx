"use client";

import * as z from "zod";
import {useForm} from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {SignUpSchema } from "@/schemas/index";
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

export const SignUpForm = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isPending, setPending] = useState(false);
    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    
    const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
        setError("");
        setSuccess(""); 
        setPending(true);
        await fetch("/api/auth/signup", {
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
        headerLabel = "Create an account" 
        backButtonLabel = "Already have an account?" 
        backButtonHref = "/login" 
        showSocial>
        <Form {...form} >
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className = "space-y-9"
            >
               <div className="space-y-6" >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className={styles.formGroup}>
                                <FormControl className={styles.formControl}>
                                    <Input 
                                        {...field}   
                                        disabled={isPending}
                                        type="text"
                                        placeholder="John Doe"
                                    />
                                </FormControl>
                                <FormLabel className={styles.formLabel}>Name</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                        placeholder="john.doe@example.com"
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
                                        placeholder="********"
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
                <Button type="submit" className="w-full" disabled={isPending}>Create an account</Button>
            </form>
        </Form>
    </CardWrapper>);
}