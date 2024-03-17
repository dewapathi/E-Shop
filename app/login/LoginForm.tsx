'use client';

import { AiOutlineGoogle } from "react-icons/ai";
import Button from "../components/Button";
import Heading from "../product/[productId]/Heading";
import Input from "../components/inputs/input";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SafeUser } from "@/types";

interface LoginFormProps {
    currentUser: SafeUser | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ currentUser }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: '',
        }
    });
    const router = useRouter();

    useEffect(() => {
        if (currentUser) {
            router.push("/cart");
            router.refresh();
        }
    }, []);

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        const result = await signIn('credentials', {
            ...data,
            redirect: false
        });

        setIsLoading(false);

        if (result?.error) {
            toast.error(result.error || "An error occurred");
        } else {
            router.push("/cart");
            toast.success("Logged In");
        }
    };

    if (currentUser) return <p className="text-center">Logged in. Redirecting...</p>;

    return (
        <>
            <Heading title="Sign in E~Shop" />
            <Button
                outline
                label="Continue with Google"
                icon={AiOutlineGoogle}
                onClick={() => {signIn('google')}}
            />
            <hr className="bg-slate-300 w-full h-px" />
            <Input
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="password"
                label="Password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type="password"
            />
            <Button
                label={isLoading ? 'Loading' : 'Login'}
                onClick={handleSubmit(onSubmit)}
            />
            <p className="text-sm">
                Do not have an account ? <Link className="underline" href="/register">
                    Sign up
                </Link>
            </p>
        </>
    )
}

export default LoginForm;