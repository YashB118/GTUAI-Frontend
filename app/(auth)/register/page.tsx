"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const BRANCHES = [
  { value: "CE", label: "Computer Engineering (CE)" },
  { value: "IT", label: "Information Technology (IT)" },
  { value: "EC", label: "Electronics & Communication (EC)" },
  { value: "ME", label: "Mechanical Engineering (ME)" },
  { value: "Civil", label: "Civil Engineering (Civil)" },
];

const SEMESTERS = Array.from({ length: 8 }, (_, i) => ({
  value: i + 1,
  label: `Semester ${i + 1}`,
}));

interface FormData {
  fullName: string;
  enrollmentNo: string;
  email: string;
  password: string;
  branch: string;
  semester: string;
  college: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    fullName: "",
    enrollmentNo: "",
    email: "",
    password: "",
    branch: "",
    semester: "",
    college: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.branch || !form.semester) {
      setError("Please select branch and semester");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          full_name: form.fullName,
          enrollment_no: form.enrollmentNo,
          branch: form.branch,
          semester: parseInt(form.semester),
          college: form.college || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      router.push("/login?registered=1");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[380px] animate-blur-in">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-accent/10 mb-5" style={{ boxShadow: "0 0 0 1px rgba(108,99,255,0.2), 0 4px 16px rgba(108,99,255,0.1)" }}>
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-text-primary">
            GTU ExamAI
          </h1>
          <p className="text-[13px] text-text-secondary mt-1">Create your student account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-7 space-y-6 bg-bg-card border border-border" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
          <div>
            <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-text-primary">Create account</h2>
            <p className="text-[13px] text-text-secondary mt-0.5">All fields required unless marked optional</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="fullName"
              label="Full Name"
              placeholder="Yash Patel"
              value={form.fullName}
              onChange={set("fullName")}
              required
            />
            <Input
              id="enrollmentNo"
              label="Enrollment No"
              placeholder="21XXXXXXXX"
              value={form.enrollmentNo}
              onChange={set("enrollmentNo")}
              required
            />
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={set("email")}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={set("password")}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                id="branch"
                label="Branch"
                placeholder="Select branch"
                value={form.branch}
                onChange={set("branch")}
                options={BRANCHES}
                required
              />
              <Select
                id="semester"
                label="Semester"
                placeholder="Select sem"
                value={form.semester}
                onChange={set("semester")}
                options={SEMESTERS}
                required
              />
            </div>
            <Input
              id="college"
              label="College (optional)"
              placeholder="Your college name"
              value={form.college}
              onChange={set("college")}
            />

            {error && (
              <p className="text-[12px] text-red-400 bg-red-500/8 border border-red-500/15 rounded-lg px-3 py-2.5">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full mt-1" loading={loading} size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-[13px] text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:text-accent-hover transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
