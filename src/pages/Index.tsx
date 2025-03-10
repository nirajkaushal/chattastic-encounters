
import { ChatInterface } from "@/components/chat-interface";
import { ThemeToggle } from "@/components/theme-toggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <ChatInterface />
    </div>
  );
};

export default Index;
