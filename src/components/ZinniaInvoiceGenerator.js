import React, { useState, useEffect } from 'react';
import { Download, Plus, Edit2, Trash2, Save, X, FileText, Users, Calendar, Loader, AlertTriangle, Printer, Clock } from 'lucide-react';

// A simple, reusable modal component for confirmations
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-start">
          <div className="mr-4 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{children}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onConfirm}
          >
            Confirmar
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};


// Componente principal del generador de facturas
const ZinniaInvoiceGenerator = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [isGenerating, setIsGenerating] = useState(false);

  // Preloaded client list
  const preloadedClients = [
    { id: 1, name: "FEK MANAGEMENT SPAIN SL", taxId: "B75822965", address: "Calle Camino del Ancho 2, Pta. 45, 28109, Alcobendas, Madrid, España", address2: "", standardAmount: "2500.00", standardSubject: "Marketing and Strategy Services", taxRate: "0", hasTax: false },
    { id: 2, name: "ESTATING OPERATIONS LUXEMBOURG SARL", taxId: "", address: "4 Rue du fort Wallis, L-2714, Luxembourg", address2: "", standardAmount: "2500.00", standardSubject: "Strategic Marketing & Content Development", taxRate: "0", hasTax: false },
    { id: 3, name: "LA HOJA CAPITAL PARTNERS", taxId: "", address: "Durango 243, Col Roma Norte CDMX, México", address2: "", standardAmount: "2500.00", standardSubject: "Marketing and Strategy Services", taxRate: "0", hasTax: false },
    { id: 4, name: "THEHORA GLOBAL FAMILY OFFICE INC.", taxId: "", address: "Suite 5, Horsford´s Business Center, Long Point Road, Nevis", address2: "", standardAmount: "325.00", standardSubject: "Strategic Executive Positioning of Jaume Horrach Pons", taxRate: "0", hasTax: false },
    { id: 5, name: "PAMPA CAPITAL ASSET MANAGEMENT", taxId: "30717987213", address: "Ortiz de Ocampo 3302, Modulo 3, Oficina 4, CABA, Argentina", address2: "", standardAmount: "1500.00", standardSubject: "Zinnia Essential Plan :: Pampa Capital", taxRate: "0", hasTax: false },
    { id: 6, name: "BAU ADVISORS LLC", taxId: "", address: "1200 Brickell Ave - Suite 1950, Miami, FL 33131, US", address2: "", standardAmount: "900.00", standardSubject: "Priority 1 scope", taxRate: "0", hasTax: false },
    { id: 7, name: "VMEO ADVISORY, S.C.", taxId: "VAD200226RS9", address: "HEGEL 221 PISO 1 POLANCO, MEXICO", address2: "", standardAmount: "1500.00", standardSubject: "Marketing and Strategy Services", taxRate: "0", hasTax: false },
    { id: 8, name: "Norfolk Capital Advisors Panamá S.A.", taxId: "2352531'1'798087 DV 4", address: "Edificio Midtown, San Francisco, Ciudad de Panamá, Panamá", address2: "Piso 17", standardAmount: "3000.00", standardSubject: "Initial Strategic Deliverables (50%)", taxRate: "0", hasTax: false }
  ];

  const [clients, setClients] = useState(preloadedClients);
  const [selectedClients, setSelectedClients] = useState([]);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  // NUEVOS ESTADOS PARA TERMS & CONDITIONS
  const [paymentDays, setPaymentDays] = useState('15');
  const [lateFeeDays, setLateFeeDays] = useState('30');
  const [lateFeeRate, setLateFeeRate] = useState('1.5');
  
  const [editingClient, setEditingClient] = useState(null);
  const [showClientForm, setShowClientForm] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, onConfirm: () => {} });

  const [clientForm, setClientForm] = useState({
    name: '', taxId: '', address: '', address2: '',
    standardAmount: '', standardSubject: '', taxRate: '0', hasTax: false
  });

  // Effect to auto-calculate due date
  useEffect(() => {
    if (invoiceDate) {
      const date = new Date(invoiceDate);
      date.setUTCDate(date.getUTCDate() + 15);
      setDueDate(date.toISOString().split('T')[0]);
    }
  }, [invoiceDate]);

  // Client form management
  const resetClientForm = () => {
    setClientForm({
      name: '', taxId: '', address: '', address2: '',
      standardAmount: '', standardSubject: '', taxRate: '0', hasTax: false
    });
  };

  const handleSaveClient = () => {
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? {...clientForm, id: editingClient.id} : c));
      setEditingClient(null);
    } else {
      const newClient = {...clientForm, id: Date.now()};
      setClients([...clients, newClient]);
    }
    resetClientForm();
    setShowClientForm(false);
  };

  const handleEditClient = (client) => {
    setClientForm(client);
    setEditingClient(client);
    setShowClientForm(true);
  };

  const handleDeleteClient = (clientId) => {
    setConfirmationModal({
        isOpen: true,
        title: "Eliminar Cliente",
        message: "¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.",
        onConfirm: () => {
            setClients(clients.filter(c => c.id !== clientId));
            setConfirmationModal({ isOpen: false });
        }
    });
  };
  
  // Formatting and calculation utilities
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${day} ${month}, ${year}`;
  };

  const calculateTotals = (subtotalAmount, taxRate, hasTax) => {
    const subtotal = parseFloat(subtotalAmount) || 0;
    const tax = hasTax ? (subtotal * parseFloat(taxRate) / 100) : 0;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };
  
  // Core HTML generation logic
  const generateInvoiceHTML = () => {
    const allInvoicesHTML = selectedClients.map(clientData => {
      const client = clients.find(c => c.id === clientData.clientId);
      if (!client) return '';

      const { subtotal, tax, total } = calculateTotals(
        clientData.subtotalAmount, client.taxRate, client.hasTax
      );
      
      const invoiceNumberForThisClient = clientData.invoiceNumber || '';
      const formatCurrency = (value) => (typeof value === 'number' ? value : parseFloat(value || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      const itemRows = [
        { description: clientData.itemDetail, quantity: clientData.quantity, rate: clientData.rate },
        ...(clientData.addOns || [])
      ].map(item => {
        const amount = (parseFloat(item.quantity || 1)) * (parseFloat(item.rate || 0));
        return `
        <tr>
            <td align="left" style="padding: 10px 0; font-weight: 600; color: #1f2937; font-size: 14px;">${item.description}</td>
            <td align="right" style="padding: 10px 0; color: #6b7280; font-size: 14px;">${item.quantity || 1}</td>
            <td align="right" style="padding: 10px 0; color: #6b7280; font-size: 14px;">$${formatCurrency(item.rate)} USD</td>
            <td align="right" style="padding: 10px 0; font-weight: 600; color: #1f2937; font-size: 14px;">$${formatCurrency(amount)} USD</td>
        </tr>
        `;
      }).join('');

      return `
        <!-- INVOICE START: ${client.name} -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr><td align="center" valign="top">
                <div class="header-box">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="left" valign="bottom" style="font-size: 12px; color: #6b7280; line-height: 1.4;">
                                <h1 style="font-family: 'Host Grotesk', sans-serif; font-size: 30px; font-weight: 600; color: #1f2937; margin: 0 0 5px 0;">ZINNIA Group LLC</h1>
                                <p style="margin: 0 0 3px 0;">EIN: 98-1826070</p><p style="margin: 0 0 3px 0;">Financial Expertise</p><p style="margin: 0 0 3px 0;">Digital Excellence</p><p style="margin: 0;">Strategic Impact</p>
                            </td>
                            <td align="right" valign="bottom" style="font-size: 12px; color: #6b7280; line-height: 1.4;">
                                <p style="margin: 0 0 5px 0;">Business Address</p><p style="margin: 0 0 3px 0;">16192 Coastal Highway, Lewes, DE 19958</p><p style="margin: 0;">legal@zinniagroup.io</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="invoice-container">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
                        <tr>
                            <td width="66.66%" align="left" valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td width="60%" align="left" valign="top">
                                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">Billed to,</p>
                                            <p style="font-weight: 600; color: #1f2937; margin: 0; font-size: 14px;">${client.name}</p>
                                            ${client.taxId ? `<p style="font-size: 14px; color: #6b7280; margin: 4px 0 0 0;">${client.taxId}</p>` : ''}
                                        </td>
                                        <td width="40%" align="left" valign="top">
                                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">Invoice number</p>
                                            <p style="font-weight: 600; color: #1f2937; margin: 0; font-size: 14px;">#ZN-${invoiceNumberForThisClient}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" align="left" valign="top" style="padding-top: 16px;">
                                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">Business address</p>
                                            <p style="font-size: 14px; color: #6b7280; margin: 0;">${client.address}</p>
                                            ${client.address2 ? `<p style="font-size: 14px; color: #6b7280; margin: 4px 0 0 0;">${client.address2}</p>` : ''}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td width="33.33%" align="right" valign="top">
                                <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">Invoice of (USD)</p>
                                <p style="font-size: 36px; font-weight: 600; color: #242D4F; margin: 0;">$${formatCurrency(total)}</p>
                            </td>
                        </tr>
                    </table>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding-bottom: 16px;">
                        <tr>
                            <td width="50%" align="left" valign="top">
                                <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">Subject</p>
                                <p style="font-weight: 600; color: #1f2937; margin: 0; font-size: 14px;">${clientData.subject}</p>
                            </td>
                            <td width="25%" align="center" valign="top">
                                <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">Invoice date</p>
                                <p style="font-weight: 600; color: #1f2937; margin: 0; font-size: 14px;">${formatDate(invoiceDate)}</p>
                            </td>
                            <td width="25%" align="right" valign="top">
                                <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">Due date</p>
                                <p style="font-weight: 600; color: #1f2937; margin: 0; font-size: 14px;">${formatDate(dueDate)}</p>
                            </td>
                        </tr>
                    </table>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; margin-top: 32px;">
                        <thead style="border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
                            <tr>
                                <th align="left" style="padding: 8px 0; font-weight: 600; text-transform: uppercase; color: #6b7280; font-size: 14px;">Item Detail</th>
                                <th align="right" style="padding: 8px 0; font-weight: 600; text-transform: uppercase; color: #6b7280; font-size: 14px;">Qty</th>
                                <th align="right" style="padding: 8px 0; font-weight: 600; text-transform: uppercase; color: #6b7280; font-size: 14px;">Rate</th>
                                <th align="right" style="padding: 8px 0; font-weight: 600; text-transform: uppercase; color: #6b7280; font-size: 14px;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemRows}
                            <tr><td colspan="4" style="height: 70px;">&nbsp;</td></tr>
                        </tbody>
                    </table>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top: 1px solid #e5e7eb;"></td></tr></table>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 16px;">
                        <tr><td align="right" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 288px;">
                                <tbody>
                                    <tr>
                                        <td align="left" style="padding: 8px 0; color: #6b7280; font-size: 14px;">Subtotal</td>
                                        <td align="right" style="padding: 8px 0; font-weight: 600; color: #1f2937; font-size: 14px;">$${formatCurrency(subtotal)} USD</td>
                                    </tr>
                                    <tr>
                                        <td align="left" style="padding: 8px 0; color: #6b7280; font-size: 14px;">Tax Rate ${client.hasTax ? `(${client.taxRate}%)` : ''}</td>
                                        <td align="right" style="padding: 8px 0; font-weight: 600; color: #1f2937; font-size: 14px;">$${formatCurrency(tax)}</td>
                                    </tr>
                                    <tr style="border-top: 1px solid #e5e7eb;">
                                        <td align="left" style="padding-top: 16px; font-weight: 600; color: #1f2937; font-size: 14px;">Total</td>
                                        <td align="right" style="padding-top: 16px; font-weight: 600; color: #242d4f; font-size: 14px;">$${formatCurrency(total)} USD</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td></tr>
                    </table>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 48px;">
                        <tr><td align="left" valign="top">
                            <p style="font-weight: 600; color: #1f2937; margin: 0; font-size: 14px;">Thank you for partnering with Zinnia.</p>
                            <p style="color: #6b7280; margin: 0; font-size: 14px;">This invoice represents our commitment to driving measurable marketing impact for your firm.</p>
                        </td></tr>
                    </table>
                </div>
            </td></tr>
        </table>
        <div class="page-break"></div>
        <!-- BANKING INSTRUCTIONS -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr><td align="center" valign="top">
                <div class="invoice-container">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 40px;">
                        <tr><td align="left">
                            <h2 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 24px 0;">ACH/Domestic Wire Instructions</h2>
                            <p style="font-size: 16px; color: #6b7280; margin: 0 0 16px 0;">Bank details</p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">ACH and Wire routing number: <span style="color: #1f2937; font-weight: 600;">121145349</span></p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Account number: <span style="color: #1f2937; font-weight: 600;">776236290086789</span></p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Account type: <span style="color: #1f2937; font-weight: 600;">Business Checking</span></p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Bank name: <span style="color: #1f2937; font-weight: 600;">Column NA - BREX</span></p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px 0;">Bank address: <span style="color: #1f2937; font-weight: 600;">1 Letterman Drive Building A, Suite A4-700, San Francisco, CA 94129 - United States</span></p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Beneficiary name: <span style="color: #1f2937; font-weight: 600;">Zinnia Group LLC</span></p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Beneficiary address: <span style="color: #1f2937; font-weight: 600;">16192 Coastal Hwy, Lewes, DE 19958 - United States</span></p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0;">EIN: <span style="color: #1f2937; font-weight: 600;">98-1826070</span></p>
                        </td></tr>
                    </table>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top: 1px solid #e5e7eb;"></td></tr></table>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 40px;">
                        <tr><td align="left">
                            <h2 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 24px 0;">International Wire Instructions</h2>
                            <p style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 0 0 16px 0;">Step 1 - Enter beneficiary bank information</p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">SWIFT/BIC Code: <span style="color: #1f2937; font-weight: 600;">CLNOUS66BRX</span></p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Bank Name: <span style="color: #1f2937; font-weight: 600;">Column NA - Brex</span></p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px 0;">Bank Address: <span style="color: #1f2937; font-weight: 600;">1 Letterman Drive Building A, Suite A4-700, San Francisco, CA 94129</span></p>
                            <p style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 0 0 16px 0;">Step 2 - Enter Intermediary bank information</p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">SWIFT/BIC code: <span style="color: #1f2937; font-weight: 600;">CHASUS33</span></p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Bank name: <span style="color: #1f2937; font-weight: 600;">JPMorgan Chase Bank N.A.</span></p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px 0;">Bank address: <span style="color: #1f2937; font-weight: 600;">383 Madison Avenue, New York, NY 10179</span></p>
                            <p style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 0 0 16px 0;">Step 3 - Enter beneficiary information</p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Beneficiary name: <span style="color: #1f2937; font-weight: 600;">Zinnia Group LLC</span></p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Beneficiary account number: <span style="color: #1f2937; font-weight: 600;">776236290086789</span></p>
                            <p style="font-size: 14px; color: #6b7280; margin: 0;">Beneficiary address: <span style="color: #1f2937; font-weight: 600;">16192 Coastal Hwy, Lewes, DE 19958</span></p>
                        </td></tr>
                    </table>
                </div>
                <div class="footer-container">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr><td align="left" style="font-size: 14px; color: #ffffff; line-height: 1.5;">
                            <p style="font-weight: 400; margin: 0 0 8px 0;">Terms & Conditions</p>
                            <p style="margin: 0;">Please pay within net ${paymentDays} days of receiving this invoice.</p>
                            <p style="margin: 0;">Invoices not paid within ${lateFeeDays} days are subject to a ${lateFeeRate}% monthly finance charge</p>
                        </td></tr>
                    </table>
                </div>
            </td></tr>
        </table>
        <!-- INVOICE END -->
      `;
    }).join('<div class="page-break"></div>');

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Zinnia Invoices</title>
        <!--[if !mso]><!-->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@600&family=Inter:wght@400;600&display=swap" rel="stylesheet">
        <!--<![endif]-->
        <style>
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
            table { border-collapse: collapse !important; }
            body { background-color: #ffffff; height: 100% !important; margin: 0 !important; padding: 40px 20px !important; width: 100% !important; font-family: 'Inter', sans-serif; font-weight: 400; }
            .invoice-container, .header-box { max-width: 800px; margin: 0 auto; background: #f2f3f1; border-radius: 12px; padding: 40px 24px; border: 1px solid #d7dae0; }
            .header-box { margin-bottom: 20px; padding: 32px 24px; }
            .footer-container { max-width: 800px; margin: 20px auto 0 auto; background: #242D4F; border-radius: 12px; padding: 32px 24px; }
            .page-break { page-break-before: always; margin-top: 40px; }
            @media print {
                .page-break { page-break-before: always; margin-top: 0; }
                body { padding: 0 !important; background-color: #ffffff !important; }
                .invoice-container, .header-box { background-color: #f2f3f1 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
                .footer-container { background-color: #242D4F !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
            }
        </style>
      </head>
      <body>${allInvoicesHTML}</body>
      </html>
    `;
  };

  const generateAndDownloadHTML = () => {
    setIsGenerating(true);
    setTimeout(() => {
        const htmlContent = generateInvoiceHTML();
        const invoiceDateFormatted = new Date(invoiceDate).toISOString().split('T')[0];
        const filename = `Zinnia-Invoices-${invoiceDateFormatted}.html`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        setIsGenerating(false);
    }, 100);
  };

  const generateAndPrintHTML = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const htmlContent = generateInvoiceHTML();
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      } else {
        console.error("La ventana emergente para impresión fue bloqueada por el navegador.");
      }
      setIsGenerating(false);
    }, 150);
  };

  const recalculateSubtotal = (invoiceData) => {
    const baseAmount = (parseFloat(invoiceData.rate) || 0) * (parseFloat(invoiceData.quantity) || 1);
    const addOnsTotal = (invoiceData.addOns || []).reduce((sum, addon) => sum + (parseFloat(addon.rate || 0) * parseFloat(addon.quantity || 1)), 0);
    invoiceData.subtotalAmount = (baseAmount + addOnsTotal).toString();
  };

  const addSelectedClient = () => {
    const firstClient = clients[0];
    if (!firstClient) return;
    setSelectedClients([...selectedClients, {
      clientId: firstClient.id,
      invoiceNumber: '',
      subject: "Marketing and Strategy Services",
      itemDetail: firstClient.standardSubject,
      quantity: '1',
      rate: firstClient.standardAmount,
      subtotalAmount: firstClient.standardAmount,
      addOns: []
    }]);
  };

  const updateSelectedClient = (index, field, value) => {
    const updated = [...selectedClients];
    const currentInvoice = updated[index];
    
    if (field === 'clientId') { value = parseInt(value); }
    currentInvoice[field] = value;

    if (field === 'clientId') {
        const newClient = clients.find(c => c.id === value);
        if(newClient) {
            currentInvoice.subject = "Marketing and Strategy Services";
            currentInvoice.itemDetail = newClient.standardSubject;
            currentInvoice.rate = newClient.standardAmount;
        }
    }
    
    recalculateSubtotal(currentInvoice);
    setSelectedClients(updated);
  };

  const removeSelectedClient = (index) => {
    setSelectedClients(selectedClients.filter((_, i) => i !== index));
  };
  
  const addAddOn = (clientIndex) => {
    const updated = [...selectedClients];
    if (!updated[clientIndex].addOns) updated[clientIndex].addOns = [];
    updated[clientIndex].addOns.push({ description: '', rate: '', quantity: '1' });
    setSelectedClients(updated);
  };

  const updateAddOn = (clientIndex, addonIndex, field, value) => {
    const updated = [...selectedClients];
    updated[clientIndex].addOns[addonIndex][field] = value;
    recalculateSubtotal(updated[clientIndex]);
    setSelectedClients(updated);
  };

  const removeAddOn = (clientIndex, addonIndex) => {
    const updated = [...selectedClients];
    updated[clientIndex].addOns.splice(addonIndex, 1);
    recalculateSubtotal(updated[clientIndex]);
    setSelectedClients(updated);
  };

  return (
    <>
    <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false })}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
    >
        {confirmationModal.message}
    </ConfirmationModal>
    <div className="min-h-screen bg-gray-50 p-6" style={{backgroundColor: '#f2f3f1', fontFamily: 'Aptos, sans-serif'}}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6" style={{borderColor: '#ebecea'}}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{color: '#242d4f'}}>Invoice Automation</h1>
              <p className="mt-1" style={{color: '#000000'}}>Zinnia Group LLC</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border mb-6" style={{borderColor: '#ebecea'}}>
          <div className="flex border-b" style={{borderColor: '#ebecea'}}>
            <button onClick={() => setActiveTab('generate')} className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'generate' ? 'border-b-2' : 'hover:opacity-80'}`} style={{color: activeTab === 'generate' ? '#242d4f' : '#ccbea7', borderBottomColor: activeTab === 'generate' ? '#dff266' : 'transparent', backgroundColor: activeTab === 'generate' ? 'rgba(223, 242, 102, 0.1)' : 'transparent'}}>
              <FileText size={16} /> Generar invoice
            </button>
            <button onClick={() => setActiveTab('clients')} className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'clients' ? 'border-b-2' : 'hover:opacity-80'}`} style={{color: activeTab === 'clients' ? '#242d4f' : '#ccbea7', borderBottomColor: activeTab === 'clients' ? '#dff266' : 'transparent', backgroundColor: activeTab === 'clients' ? 'rgba(223, 242, 102, 0.1)' : 'transparent'}}>
              <Users size={16} /> Gestionar clientes ({clients.length})
            </button>
          </div>

          {activeTab === 'generate' && (
            <div className="p-6">
              {clients.length === 0 ? (
                <div className="text-center py-12"><p>Primero, añade clientes en la pestaña "Gestionar clientes".</p></div>
              ) : (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{color: '#242d4f'}}>Invoice date</label>
                        <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-full px-3 py-2 border rounded-md" style={{borderColor: '#ebecea'}}/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{color: '#242d4f'}}>Due date</label>
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 border rounded-md" style={{borderColor: '#ebecea'}}/>
                      </div>
                   </div>

                   {/* NUEVA SECCIÓN: TERMS & CONDITIONS */}
                   <div className="mt-4 p-4 bg-gray-50 rounded-lg" style={{borderColor: '#ebecea'}}>
                     <h4 className="text-md font-medium mb-3" style={{color: '#242d4f'}}>Terms & Conditions</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div>
                         <label className="block text-xs font-medium text-gray-700 mb-1">Payment Days</label>
                         <input 
                           type="number" 
                           value={paymentDays} 
                           onChange={(e) => setPaymentDays(e.target.value)} 
                           className="w-full px-3 py-2 border rounded-md text-sm" 
                           style={{borderColor: '#ebecea'}}
                           placeholder="15"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-medium text-gray-700 mb-1">Late Fee Days</label>
                         <input 
                           type="number" 
                           value={lateFeeDays} 
                           onChange={(e) => setLateFeeDays(e.target.value)} 
                           className="w-full px-3 py-2 border rounded-md text-sm" 
                           style={{borderColor: '#ebecea'}}
                           placeholder="30"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-medium text-gray-700 mb-1">Late Fee Rate (%)</label>
                         <input 
                           type="number" 
                           step="0.1"
                           value={lateFeeRate} 
                           onChange={(e) => setLateFeeRate(e.target.value)} 
                           className="w-full px-3 py-2 border rounded-md text-sm" 
                           style={{borderColor: '#ebecea'}}
                           placeholder="1.5"
                         />
                       </div>
                     </div>
                   </div>

                   <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium" style={{color: '#242d4f'}}>Cliente a facturar</h3>
                        <button onClick={addSelectedClient} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md" style={{backgroundColor: '#dff266', color: '#242d4f'}}>
                            <Plus className="mr-1 h-4 w-4" /> Agregar cliente
                        </button>
                      </div>
                      <div className="mt-4">
                          {selectedClients.length > 0 ? (
                            <div className="space-y-4">
                              {selectedClients.map((selectedClient, index) => {
                                const client = clients.find(c => c.id === selectedClient.clientId);
                                const { total } = client ? calculateTotals(selectedClient.subtotalAmount, client.taxRate, client.hasTax) : { total: 0 };
                                return (
                                  <div key={index} className="border rounded-lg p-4 bg-gray-50" style={{borderColor: '#ebecea'}}>
                                      <div className="flex justify-between items-start mb-4">
                                          <h4 className="font-medium text-gray-900">Invoice para {client?.name || 'cliente'}</h4>
                                          <button onClick={() => removeSelectedClient(index)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Billed to</label>
                                          <select value={selectedClient.clientId} onChange={(e) => updateSelectedClient(index, 'clientId', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                            {clients.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                          </select>
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Invoice number</label>
                                          <div className="flex items-center">
                                              <span className="text-gray-500 pr-2">#ZN-</span>
                                              <input type="text" value={selectedClient.invoiceNumber} onChange={(e) => updateSelectedClient(index, 'invoiceNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="ej: 43" />
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                          <input type="text" value={selectedClient.subject} onChange={(e) => updateSelectedClient(index, 'subject', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                                        </div>
                                      </div>
                                      
                                      <div className="mt-4 border-t pt-4">
                                          <h5 className="text-md font-medium text-gray-800 mb-2">Detalles del invoice</h5>
                                          <div className="grid grid-cols-12 gap-2 items-end mb-2">
                                              <div className="col-span-6"><label className="text-xs font-medium text-gray-500">Item Detail</label><input type="text" value={selectedClient.itemDetail} onChange={(e) => updateSelectedClient(index, 'itemDetail', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm" /></div>
                                              <div className="col-span-2"><label className="text-xs font-medium text-gray-500">Qty</label><input type="number" value={selectedClient.quantity} onChange={(e) => updateSelectedClient(index, 'quantity', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm" /></div>
                                              <div className="col-span-3"><label className="text-xs font-medium text-gray-500">Rate</label><input type="number" step="0.01" value={selectedClient.rate} onChange={(e) => updateSelectedClient(index, 'rate', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm" /></div>
                                          </div>
                                          {selectedClient.addOns.map((addon, addonIndex) => (
                                             <div key={addonIndex} className="grid grid-cols-12 gap-2 items-end mb-2">
                                                  <div className="col-span-6"><input type="text" placeholder="Descripción del ítem adicional" value={addon.description} onChange={e => updateAddOn(index, addonIndex, 'description', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm" /></div>
                                                  <div className="col-span-2"><input type="number" placeholder="1" value={addon.quantity} onChange={e => updateAddOn(index, addonIndex, 'quantity', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm" /></div>
                                                  <div className="col-span-3"><input type="number" step="0.01" placeholder="0.00" value={addon.rate} onChange={e => updateAddOn(index, addonIndex, 'rate', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm" /></div>
                                                  <div className="col-span-1"><button onClick={() => removeAddOn(index, addonIndex)} className="text-red-500 hover:text-red-700 p-1"><X size={16}/></button></div>
                                             </div>
                                          ))}
                                          <button onClick={() => addAddOn(index)} className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2"><Plus size={14} className="inline mr-1"/>Añadir Ítem</button>
                                      </div>

                                       <div className="mt-4 p-3 bg-blue-50 rounded-md">
                                          <div className="flex justify-between items-center">
                                              <span className="font-medium text-blue-900">Amount:</span>
                                              <span className="text-lg font-bold text-blue-900">${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
                                          </div>
                                      </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-12 px-6 border-2 border-dashed rounded-lg" style={{borderColor: '#ccbea7'}}>
                                <Clock className="mx-auto h-12 w-12" style={{color: '#ccbea7'}} />
                                <p className="mt-4 text-lg font-medium" style={{color: '#ccbea7'}}>
                                    No hay clientes seleccionados
                                </p>
                            </div>
                          )}
                      </div>
                   </div>

                  {selectedClients.length > 0 && (
                    <div className="border-t pt-6 mt-6">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={generateAndPrintHTML}
                          disabled={isGenerating}
                          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGenerating ? <Loader className="animate-spin mr-2 h-5 w-5" /> : <Printer className="mr-2 h-5 w-5" />}
                          Imprimir HTML
                        </button>
                        <button
                          onClick={generateAndDownloadHTML}
                          disabled={isGenerating}
                          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{backgroundColor: '#242d4f', color: '#ffffff'}}
                        >
                          {isGenerating ? <Loader className="animate-spin mr-2 h-5 w-5" /> : <Download className="mr-2 h-5 w-5" />}
                          Descargar HTML
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-lg font-medium" style={{color: '#242d4f'}}>Gestionar clientes</h2>
                 <button onClick={() => { resetClientForm(); setEditingClient(null); setShowClientForm(true); }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white" style={{backgroundColor: '#242d4f'}}>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
                 </button>
              </div>

              {showClientForm && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente *</label><input type="text" value={clientForm.name} onChange={(e) => setClientForm({...clientForm, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nombre de la Empresa" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">NIF (opcional)</label><input type="text" value={clientForm.taxId} onChange={(e) => setClientForm({...clientForm, taxId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="ej: NIF" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Dirección Línea 1 *</label><input type="text" value={clientForm.address} onChange={(e) => setClientForm({...clientForm, address: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Dirección principal" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Dirección Línea 2 (opcional)</label><input type="text" value={clientForm.address2} onChange={(e) => setClientForm({...clientForm, address2: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Piso, apartamento, etc." /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Importe Estándar *</label><input type="number" step="0.01" value={clientForm.standardAmount} onChange={(e) => setClientForm({...clientForm, standardAmount: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="0.00" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Detalle del Ítem Estándar *</label><input type="text" value={clientForm.standardSubject} onChange={(e) => setClientForm({...clientForm, standardSubject: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Descripción del servicio" /></div>
                    <div className="md:col-span-2 grid grid-cols-2 gap-4 items-center">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tasa de Impuesto (%)</label>
                            <input 
                                type="number" 
                                step="0.01" 
                                value={clientForm.taxRate} 
                                onChange={(e) => setClientForm({...clientForm, taxRate: e.target.value})} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-200" 
                                placeholder="0.00"
                                disabled={!clientForm.hasTax}
                            />
                        </div>
                        <div className="flex items-end h-full pb-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <input 
                                    type="checkbox" 
                                    checked={clientForm.hasTax} 
                                    onChange={(e) => setClientForm({...clientForm, hasTax: e.target.checked})} 
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                Aplica Impuesto
                            </label>
                        </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setShowClientForm(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                    <button onClick={handleSaveClient} disabled={!clientForm.name || !clientForm.address || !clientForm.standardAmount || !clientForm.standardSubject} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
                        <Save className="mr-2 h-4 w-4 inline" /> {editingClient ? 'Actualizar' : 'Guardar'} Cliente
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {clients.map(client => (
                  <div key={client.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-900">{client.name}</h3>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClient(client)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteClient(client.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {client.taxId && <p><span className="font-medium">NIF:</span> {client.taxId}</p>}
                      <p><span className="font-medium">Dirección:</span> {client.address}</p>
                      {client.address2 && <p>{client.address2}</p>}
                      <p><span className="font-medium">Importe Est.:</span> ${parseFloat(client.standardAmount).toFixed(2)} USD</p>
                      <p><span className="font-medium">Detalle Est.:</span> {client.standardSubject}</p>
                      <p><span className="font-medium">Tasa Imp.:</span> {client.hasTax ? `${client.taxRate}%` : 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default ZinniaInvoiceGenerator;
