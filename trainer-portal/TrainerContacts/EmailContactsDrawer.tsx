"use client";

import AppDrawer from "@/components/app/AppDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContactRecord } from "@/app/api/trainer/Types";
import { Mail, Send } from "lucide-react";
import { useState } from "react";

interface EmailContactsDrawerProps {
  open: boolean;
  onClose: () => void;
  contacts: (ContactRecord & { id: string })[];
}

export default function EmailContactsDrawer({
  open,
  onClose,
  contacts,
}: EmailContactsDrawerProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSendEmail() {
    const recipients = contacts.map(contact => contact.Email).join(',');
    const emailBody = encodeURIComponent(message);
    const emailSubject = encodeURIComponent(subject);
    
    const mailtoLink = `mailto:${recipients}?subject=${emailSubject}&body=${emailBody}`;
    window.open(mailtoLink);
    
    onClose();
    setSubject("");
    setMessage("");
  }

  function handleClose() {
    onClose();
    setSubject("");
    setMessage("");
  }

  return (
    <AppDrawer
      open={open}
      onClose={handleClose}
      headerTitle={`Email ${contacts.length} Contact${contacts.length === 1 ? '' : 's'}`}
      headerOptions={
        <Button
          onClick={handleSendEmail}
          disabled={!subject.trim() || !message.trim()}
          size="sm"
          className="gap-2"
        >
          <Send size={16} />
          Send
        </Button>
      }
      body={
        <div className="p-4 space-y-4">
          {/* Recipients Preview */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              To ({contacts.length})
            </Label>
            <div className="mt-1 p-3 bg-muted rounded-md text-sm">
              {contacts.map((contact, index) => (
                <span key={contact.id}>
                  {contact.FirstName} {contact.LastName} ({contact.Email})
                  {index < contacts.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message"
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              rows={8}
              className="resize-none"
            />
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
            <Mail size={16} className="mt-0.5 flex-shrink-0" />
            <p>
              This will open your default email client with the recipients, subject, and message pre-filled.
            </p>
          </div>
        </div>
      }
    />
  );
}