import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    content: string;
    sender: "user" | "bot";
    timestamp: Date;
}

const initialMessages: Message[] = [
    {
        id: "1",
        content: "👋 Hello! I'm your CRM assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
    },
];

const quickReplies = [
    "How do I add a new lead?",
    "Show me today's appointments",
    "How to create a visa application?",
    "Help with student documents",
];

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputValue, setInputValue] = useState("");

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");

        // Simulate bot response
        setTimeout(() => {
            const botResponses: Record<string, string> = {
                "how do i add a new lead?": "To add a new lead, go to the Leads page from the sidebar and click the 'Add Lead' button. Fill in the required information like name, email, and contact details.",
                "show me today's appointments": "You can view today's appointments on the Dashboard or go to the Appointments page. The upcoming appointments section shows all scheduled meetings.",
                "how to create a visa application?": "Navigate to the Students section, select a student, and click 'Create Visa Application'. You'll need to select the visa type and follow the workflow steps.",
                "help with student documents": "Go to the Students page, select a student, and click on the 'Documents' tab. You can upload, view, and manage all student documents there.",
            };

            const response = botResponses[inputValue.toLowerCase()] ||
                "I'm here to help! You can ask me about leads, students, appointments, or visa applications. For more complex queries, please contact our support team.";

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: response,
                sender: "bot",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        }, 1000);
    };

    const handleQuickReply = (reply: string) => {
        setInputValue(reply);
    };

    return (
        <>
            {/* Chat Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50",
                    "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
                    "transition-all duration-300 hover:scale-110"
                )}
                size="icon"
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageCircle className="h-6 w-6" />
                )}
            </Button>

            {/* Chat Window */}
            {isOpen && (
                <Card className={cn(
                    "fixed bottom-24 right-6 w-[380px] h-[500px] z-50",
                    "shadow-2xl border-0 overflow-hidden",
                    "animate-in slide-in-from-bottom-5 duration-300"
                )}>
                    {/* Header */}
                    <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-semibold">CRM Assistant</CardTitle>
                                <p className="text-xs text-primary-foreground/80">Always here to help</p>
                            </div>
                        </div>
                    </CardHeader>

                    {/* Messages */}
                    <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex gap-2",
                                            message.sender === "user" ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {message.sender === "bot" && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    <Bot className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div
                                            className={cn(
                                                "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                                                message.sender === "user"
                                                    ? "bg-primary text-primary-foreground rounded-br-md"
                                                    : "bg-muted text-foreground rounded-bl-md"
                                            )}
                                        >
                                            {message.content}
                                        </div>
                                        {message.sender === "user" && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    <User className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Quick Replies */}
                            {messages.length <= 2 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {quickReplies.map((reply) => (
                                        <Button
                                            key={reply}
                                            variant="outline"
                                            size="sm"
                                            className="text-xs h-7 rounded-full"
                                            onClick={() => handleQuickReply(reply)}
                                        >
                                            {reply}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-4 border-t border-border">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="flex gap-2"
                            >
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 rounded-full bg-muted border-0"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="rounded-full h-10 w-10"
                                    disabled={!inputValue.trim()}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
