import { useState } from "react";
import { CodeReviewDashboard } from "@/components/CodeReviewDashboard";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <CodeReviewDashboard onAuthClick={() => setShowAuth(true)} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Index;
