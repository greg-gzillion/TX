'use client';

import * as React from 'react';

export type EmailStatus = 'idle' | 'sending' | 'sent' | 'failed';
export type EmailType = 'receipt' | 'confirmation' | 'shipping' | 'escrow' | 'dispute' | 'completion';

export interface EmailTemplate {
  id: string;
  type: EmailType;
  subject: string;
  content: string;
  variables: string[];
  isEnabled: boolean;
}

export interface EmailRecipient {
  email: string;
  name?: string;
  role: 'buyer' | 'seller' | 'both';
}

export interface EmailData {
  transactionId: string;
  amount: number;
  currency: string;
  metalType: string;
  weight: number;
  shippingInfo?: string;
  escrowInfo?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface EmailNotificationsProps {
  recipient: EmailRecipient;
  emailData: EmailData;
  templates: EmailTemplate[];
  onSend: (emailType: EmailType, recipientEmail: string) => Promise<boolean>;
  onPreview?: (template: EmailTemplate, filledContent: string) => void;
  onCustomize?: (template: EmailTemplate) => void;
}

export default function EmailNotifications({
  recipient,
  emailData,
  templates,
  onSend,
  onPreview,
  onCustomize,
}: EmailNotificationsProps) {
  const [selectedEmail, setSelectedEmail] = React.useState<EmailType>('receipt');
  const [statuses, setStatuses] = React.useState<Record<EmailType, EmailStatus>>({
    receipt: 'idle',
    confirmation: 'idle',
    shipping: 'idle',
    escrow: 'idle',
    dispute: 'idle',
    completion: 'idle',
  });
  const [showAllTemplates, setShowAllTemplates] = React.useState(false);
  const [customMessage, setCustomMessage] = React.useState<string>('');
  const [includeCC, setIncludeCC] = React.useState<boolean>(true);
  const [emailHistory, setEmailHistory] = React.useState<Array<{
    type: EmailType;
    timestamp: Date;
    status: EmailStatus;
    recipient: string;
  }>>([]);

  const getTemplate = (type: EmailType): EmailTemplate | undefined => {
    return templates.find(t => t.type === type && t.isEnabled);
  };

  const fillTemplateVariables = (template: EmailTemplate): string => {
    let content = template.content;
    
    // Replace variables with actual data
    content = content.replace(/{{transactionId}}/g, emailData.transactionId);
    content = content.replace(/{{amount}}/g, emailData.amount.toString());
    content = content.replace(/{{currency}}/g, emailData.currency);
    content = content.replace(/{{metalType}}/g, emailData.metalType);
    content = content.replace(/{{weight}}/g, emailData.weight.toString());
    content = content.replace(/{{recipientName}}/g, recipient.name || 'Valued Customer');
    
    if (emailData.shippingInfo) {
      content = content.replace(/{{shippingInfo}}/g, emailData.shippingInfo);
    }
    
    if (emailData.escrowInfo) {
      content = content.replace(/{{escrowInfo}}/g, emailData.escrowInfo);
    }
    
    if (emailData.trackingNumber) {
      content = content.replace(/{{trackingNumber}}/g, emailData.trackingNumber);
    }
    
    if (emailData.estimatedDelivery) {
      content = content.replace(/{{estimatedDelivery}}/g, emailData.estimatedDelivery);
    }
    
    return content;
  };

  const getEmailIcon = (type: EmailType): string => {
    switch (type) {
      case 'receipt': return '🧾';
      case 'confirmation': return '✅';
      case 'shipping': return '🚚';
      case 'escrow': return '🤝';
      case 'dispute': return '⚠️';
      case 'completion': return '🎉';
      default: return '📧';
    }
  };

  const getEmailColor = (type: EmailType): string => {
    switch (type) {
      case 'receipt': return 'bg-green-100 text-green-800';
      case 'confirmation': return 'bg-blue-100 text-blue-800';
      case 'shipping': return 'bg-yellow-100 text-yellow-800';
      case 'escrow': return 'bg-purple-100 text-purple-800';
      case 'dispute': return 'bg-red-100 text-red-800';
      case 'completion': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendEmail = async (emailType: EmailType) => {
    setStatuses(prev => ({ ...prev, [emailType]: 'sending' }));
    
    try {
      const success = await onSend(emailType, recipient.email);
      
      if (success) {
        setStatuses(prev => ({ ...prev, [emailType]: 'sent' }));
        setEmailHistory(prev => [
          {
            type: emailType,
            timestamp: new Date(),
            status: 'sent',
            recipient: recipient.email,
          },
          ...prev.slice(0, 9), // Keep last 10 emails
        ]);
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setStatuses(prev => ({ ...prev, [emailType]: 'idle' }));
        }, 3000);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      setStatuses(prev => ({ ...prev, [emailType]: 'failed' }));
      console.error('Failed to send email:', error);
    }
  };

  const handleSendAll = async () => {
    const enabledTemplates = templates.filter(t => t.isEnabled);
    
    for (const template of enabledTemplates) {
      if (recipient.role === 'both' || 
          (recipient.role === 'buyer' && template.type !== 'escrow') ||
          (recipient.role === 'seller' && template.type !== 'receipt')) {
        await handleSendEmail(template.type);
        // Small delay between emails
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  const getEmailDescription = (type: EmailType): string => {
    switch (type) {
      case 'receipt': return 'Digital receipt with transaction details';
      case 'confirmation': return 'Order confirmation and next steps';
      case 'shipping': return 'Shipping updates and tracking information';
      case 'escrow': return 'Escrow status and release conditions';
      case 'dispute': return 'Dispute resolution procedures';
      case 'completion': return 'Transaction completion notice';
      default: return 'Email notification';
    }
  };

  const getStatusIcon = (status: EmailStatus): string => {
    switch (status) {
      case 'idle': return '📧';
      case 'sending': return '⏳';
      case 'sent': return '✅';
      case 'failed': return '❌';
      default: return '📧';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Email Notifications</h2>
        <p className="text-gray-600 mt-2">Manage your transaction notifications</p>
      </div>

      {/* Recipient Info */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recipient Information</h3>
            <p className="text-gray-600 text-sm mt-1">All emails will be sent to:</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👤</span>
            <div className="text-right">
              <div className="font-medium">{recipient.email}</div>
              <div className="text-sm text-gray-600 capitalize">{recipient.role}</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeCC}
                onChange={(e) => setIncludeCC(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Also send to support@phoenixpme.com for records</span>
            </label>
          </div>
          
          <button
            onClick={() => setShowAllTemplates(!showAllTemplates)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showAllTemplates ? 'Show Only Active' : 'Show All Templates'}
          </button>
        </div>
      </div>

      {/* Email Templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
          <button
            onClick={handleSendAll}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90"
          >
            Send All Active Emails
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {templates
            .filter(template => showAllTemplates || template.isEnabled)
            .map((template) => (
              <div
                key={template.id}
                className={`bg-white border rounded-lg p-4 ${
                  !template.isEnabled ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${getEmailColor(template.type)}`}>
                      {getEmailIcon(template.type)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{template.subject}</div>
                      <div className="text-sm text-gray-600">
                        {getEmailDescription(template.type)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getStatusIcon(statuses[template.type])}</span>
                    {!template.isEnabled && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Disabled
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {fillTemplateVariables(template).substring(0, 100)}...
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSendEmail(template.type)}
                    disabled={!template.isEnabled || statuses[template.type] === 'sending'}
                    className={`px-3 py-2 rounded text-sm font-medium ${
                      template.isEnabled && statuses[template.type] === 'idle'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {statuses[template.type] === 'sending' ? 'Sending...' :
                     statuses[template.type] === 'sent' ? 'Sent!' :
                     statuses[template.type] === 'failed' ? 'Failed - Retry' :
                     'Send Email'}
                  </button>
                  
                  {onPreview && (
                    <button
                      onClick={() => onPreview(template, fillTemplateVariables(template))}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                    >
                      Preview
                    </button>
                  )}
                  
                  {onCustomize && (
                    <button
                      onClick={() => onCustomize(template)}
                      className="px-3 py-2 border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-50"
                    >
                      Customize
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Custom Message */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Message</h3>
        <div className="space-y-4">
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Add a custom message to include with all emails..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              This message will be appended to all emails sent.
            </div>
            <div className="text-sm text-gray-500">
              {customMessage.length}/500 characters
            </div>
          </div>
        </div>
      </div>

      {/* Email History */}
      {emailHistory.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Email History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 border-b">
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Recipient</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {emailHistory.map((email, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <span>{getEmailIcon(email.type)}</span>
                        <span className="capitalize">{email.type}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-700">
                      {email.recipient}
                    </td>
                    <td className="py-3 text-sm text-gray-700">
                      {email.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                        email.status === 'sent' ? 'bg-green-100 text-green-800' :
                        email.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        <span className="mr-1">{getStatusIcon(email.status)}</span>
                        <span className="capitalize">{email.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delivery Settings */}
      <div className="bg-gray-50 border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Settings</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Email Preferences</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Send receipt immediately after payment</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Send shipping updates</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Send escrow status changes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Send completion confirmation</span>
              </label>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Notification Channels</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Email Notifications</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">SMS Alerts</span>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Push Notifications</span>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Webhook Callbacks</span>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <span className="text-3xl">💡</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Email Support</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Emails are sent from notifications@phoenixpme.com</li>
              <li>• Check spam folder if emails are not received</li>
              <li>• All emails include unsubscribe links</li>
              <li>• Delivery time: Usually within 1-5 minutes</li>
              <li>• Support: email-support@phoenixpme.com</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="text-center text-sm text-gray-600">
        <p>Emails will be sent to: <strong>{recipient.email}</strong></p>
        <p className="mt-1">Active templates: {templates.filter(t => t.isEnabled).length} of {templates.length}</p>
        <p className="mt-1">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
