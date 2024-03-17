'use client'

import { useEffect, useState } from "react";
import Input from "../components/inputs/input";
import Heading from "../product/[productId]/Heading";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";

interface RegisterFormProps {
    currentUser: SafeUser | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ currentUser }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
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
        try {
            await axios.post("/api/register", data);
            toast.success("Account created");

            const result = await signIn('credentials', { // Updated to use await
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.ok) {
                toast.success("Logged In");
                router.push('/cart');
            } else {
                toast.error("Sign in failed");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (currentUser) return <p className="text-center">Logged in. Redirecting...</p>;

    return (
        <>
            <Heading title="Sign up for E~Shop" />
            <Button
                outline
                label="Sign up with Google"
                icon={AiOutlineGoogle}
                onClick={() => {signIn('google')}}
            />
            <hr className="bg-slate-300 w-full h-px" />
            <Input
                id="name"
                label="Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
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
                label={isLoading ? 'Loading' : 'Sign'}
                onClick={handleSubmit(onSubmit)}
            />
            <p className="text-sm">
                Already have an account ? <Link className="underline" href="/login">
                    Log in
                </Link>
            </p>
        </>
    )
}

export default RegisterForm;