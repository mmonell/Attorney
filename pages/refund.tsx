
const Refund = () => (
  <div className="min-h-screen bg-black text-white py-16 px-4 flex flex-col items-center">
    <div className="max-w-3xl w-full">
      <h1 className="text-4xl font-bold mb-8 text-center">Refund Policies</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Eligibility for Refunds</h2>
        <p className="text-white/80 mb-2">Refunds are available for services not rendered or in cases of billing errors. Please contact Rosie Tejada for eligibility review.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Requesting a Refund</h2>
        <ul className="list-disc list-inside text-white/80 space-y-2">
          <li>Submit your refund request through the contact page</li>
          <li>Include your name, contact information, and invoice number</li>
          <li>Describe the reason for your request</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Processing Refunds</h2>
        <p className="text-white/80 mb-2">Refunds are processed within 14 business days after approval. You will be notified via email regarding the status of your request.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Exceptions</h2>
        <p className="text-white/80 mb-2">Refunds are not available for services already rendered or for non-refundable fees as stated in your agreement.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">5. Contact</h2>
        <p className="text-white/80 mb-2">For questions about refunds, contact Rosie Tejada through the contact page.</p>
      </section>
    </div>
  </div>
);

export default Refund;
