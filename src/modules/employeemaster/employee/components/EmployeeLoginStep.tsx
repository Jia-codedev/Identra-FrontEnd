import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/Input";;
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, RefreshCw, Copy, Check } from "lucide-react";
import { EmployeeStepProps } from "./types";
import { toast } from "sonner";

export const EmployeeLoginStep: React.FC<EmployeeStepProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    
    // Ensure at least one character from each required set
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*";
    
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest with random characters
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    onInputChange("password", password);
    onInputChange("confirm_password", password);
    toast.success("Password generated successfully!");
  }, [onInputChange]);

  const copyPassword = useCallback(async () => {
    if (formData.password) {
      try {
        await navigator.clipboard.writeText(formData.password);
        setCopied(true);
        toast.success("Password copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy password:", error);
        toast.error("Failed to copy password");
      }
    }
  }, [formData.password]);

  const generateLoginId = useCallback(() => {
    if (formData.firstname_eng && formData.lastname_eng) {
      const baseId = `${formData.firstname_eng.toLowerCase()}.${formData.lastname_eng.toLowerCase()}`;
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const loginId = `${baseId}${randomSuffix}`;
      onInputChange("login_id", loginId);
      toast.success("Login ID generated successfully!");
    } else {
      toast.error("Please fill in first name and last name first");
    }
  }, [formData.firstname_eng, formData.lastname_eng, onInputChange]);

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Login Credentials
          </h4>
          <div className="text-xs text-muted-foreground">
            * Required for system access
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="login_id" className="text-sm font-medium">
              Login ID *
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="login_id"
                value={formData.login_id}
                onChange={(e) => onInputChange("login_id", e.target.value)}
                placeholder="Enter login ID or generate from name"
                className={`${errors.login_id ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateLoginId}
                disabled={!formData.firstname_eng || !formData.lastname_eng}
                className="whitespace-nowrap"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Generate
              </Button>
            </div>
            {errors.login_id && (
              <p className="text-red-500 text-xs mt-1">{errors.login_id}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              This will be used to login to the system
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Password Settings
        </h4>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="password" className="text-sm font-medium">
              Password *
            </Label>
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => onInputChange("password", e.target.value)}
                  placeholder="Enter password or generate one"
                  className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generatePassword}
                className="whitespace-nowrap"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Generate
              </Button>
              {formData.password && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyPassword}
                  className="whitespace-nowrap"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            <div className="text-xs text-muted-foreground mt-1 space-y-1">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
                <li>Contains at least one special character (!@#$%^&*)</li>
              </ul>
            </div>
          </div>

          <div>
            <Label htmlFor="confirm_password" className="text-sm font-medium">
              Confirm Password *
            </Label>
            <div className="relative mt-1">
              <Input
                id="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirm_password}
                onChange={(e) => onInputChange("confirm_password", e.target.value)}
                placeholder="Re-enter password to confirm"
                className={`pr-10 ${errors.confirm_password ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.confirm_password && (
              <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 mt-0.5">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Security Note</p>
            <p>
              The generated password will be securely stored in the system. 
              Make sure to share the login credentials with the employee through a secure channel.
              The employee should change the password upon first login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
