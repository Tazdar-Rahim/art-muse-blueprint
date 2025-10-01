import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Send, Settings, BarChart } from 'lucide-react';
import { EmailTemplates } from '@/components/admin/email/EmailTemplates';
import { EmailTriggers } from '@/components/admin/email/EmailTriggers';
import { EmailLogs } from '@/components/admin/email/EmailLogs';
import { EmailSettings } from '@/components/admin/email/EmailSettings';

export default function EmailManagement() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Management</h1>
        <p className="text-muted-foreground">
          Manage email templates, triggers, and delivery settings
        </p>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="triggers" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Triggers</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Logs</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <EmailTemplates />
        </TabsContent>

        <TabsContent value="triggers">
          <EmailTriggers />
        </TabsContent>

        <TabsContent value="logs">
          <EmailLogs />
        </TabsContent>

        <TabsContent value="settings">
          <EmailSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
