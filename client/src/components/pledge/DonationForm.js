import { useState } from 'react';
import { useInitDonationMutation, useCompletePledgeMutation } from '../../redux/api/apiSlice';

export default function DonationForm({ pledgeId }) {
  const [donationAmount, setDonationAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');

  const [initDonation, { isLoading: isDonating }] = useInitDonationMutation();
  const [completePledge, { isLoading: isCompleting }] = useCompletePledgeMutation();

  const handleDonate = async () => {
    const amount = customAmount ? parseFloat(customAmount) : donationAmount;
    if (!amount || amount <= 0) return;

    try {
      const res = await initDonation({ pledgeId, amount }).unwrap();

      if (res.success) {
        const pd = res.payuData;

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = pd.url || process.env.NEXT_PUBLIC_PAYU_URL || 'https://test.payu.in/_payment';

        const inputs = {
          key: pd.key,
          txnid: pd.txnid,
          amount: pd.amount,
          productinfo: pd.productinfo,
          firstname: pd.firstname,
          email: pd.email,
          phone: pd.phone,
          surl: pd.surl,
          furl: pd.furl,
          hash: pd.hash
        };

        for (const key in inputs) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = inputs[key];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNoThanks = async () => {
    try {
      const res = await completePledge({ pledgeId }).unwrap();
      if (res.success) {
        window.location.href = `/pledge/success?id=${pledgeId}&cert=${res.certificateNumber}`;
      }
    } catch (error) {
      console.error(error);
      window.location.href = `/pledge/success?id=${pledgeId}`;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[100, 250, 500, 1000].map(amt => (
          <button
            key={amt}
            onClick={() => { setDonationAmount(amt); setCustomAmount(''); }}
            className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${donationAmount === amt && !customAmount
                ? 'border-[#FF9933] bg-[#FF9933]/10 text-[#E6852E] shadow-sm'
                : 'border-gray-200 text-[#4a4a4a] hover:border-[#FF9933]/30 bg-white'
              }`}
          >
            ₹{amt}
          </button>
        ))}
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-[#4a4a4a] mb-2">Other Amount (₹)</label>
        <input
          type="number"
          value={customAmount}
          onChange={(e) => { setCustomAmount(e.target.value); setDonationAmount(0); }}
          className="w-full rounded-xl bg-[#FAFAFA] border-gray-200 px-4 py-3 border focus:border-[#FF9933] outline-none text-[#1a1a1a]"
          placeholder="Enter custom amount"
        />
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleDonate}
          disabled={isDonating || isCompleting}
          className="w-full bg-[#FF9933] text-white font-bold py-4 rounded-xl shadow-[0_0_25px_-5px_rgba(255,153,51,0.5)] hover:bg-[#E6852E] hover:-translate-y-0.5 transition-all disabled:opacity-70"
        >
          {isDonating ? 'PROCESSING...' : 'DONATE NOW'}
        </button>
        <button
          onClick={handleNoThanks}
          disabled={isCompleting || isDonating}
          className="w-full bg-[#FAFAFA] text-[#4a4a4a] font-medium py-4 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all disabled:opacity-70"
        >
          {isCompleting ? 'PLEASE WAIT...' : 'NO, THANK YOU'}
        </button>
      </div>
    </div>
  );
}
