import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Code2, User, Mail, Lock, UserPlus, LogIn, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [signInData, setSignInData] = useState({
    username: "",
    password: ""
  });
  
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in:", signInData);
    // Here you would handle authentication
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up:", signUpData);
    // Here you would handle registration
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            Welcome to AI Code Reviewer
          </DialogTitle>
          <DialogDescription>
            Sign in or create an account to access advanced AI-powered code analysis
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Badge variant="outline" className="mb-4 bg-warning/10 text-warning border-warning/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Demo UI - Connect Supabase for full authentication
          </Badge>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="signin" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-username" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </Label>
                  <Input
                    id="signin-username"
                    type="text"
                    placeholder="Enter your username"
                    value={signInData.username}
                    onChange={(e) => setSignInData(prev => ({ ...prev, username: e.target.value }))}
                    className="bg-code-bg border-code-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-code-bg border-code-border"
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={!signInData.username || !signInData.password}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="Choose a username"
                    value={signUpData.username}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, username: e.target.value }))}
                    className="bg-code-bg border-code-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-code-bg border-code-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-code-bg border-code-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm Password
                  </Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="bg-code-bg border-code-border"
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={!signUpData.username || !signUpData.email || !signUpData.password || signUpData.password !== signUpData.confirmPassword}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}