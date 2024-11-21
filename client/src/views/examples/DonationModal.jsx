import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { donateToCause } from "../../store/causes-slice/causesSlice";

const DonationModal = ({ causeId, onClose }) => {

  const [donorId, setDonorId] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();


  const validate = () => {
    const newErrors = {};
    if (!donorId) newErrors.donorId = "Donor ID is required";
    if (!amount || amount <= 0)
      newErrors.amount = "Please enter a valid donation amount";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(donateToCause({ causeId, donorId, amount }));
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Make a Donation</h5>
            <h6>CauseID: {causeId}</h6>
            <button
              type="button"
              onClick={onClose}
              className="border-0 outline-none bg-transparent text-xl font-semibold focus:ring-0"
            >
              X
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Donor ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={donorId}
                  onChange={(e) => setDonorId(e.target.value)}
                />
                {errors.donorId && (
                  <div className="text-danger">{errors.donorId}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                {errors.amount && (
                  <div className="text-danger">{errors.amount}</div>
                )}
              </div>
              <button type="submit" className="btn btn-primary">
                Donate
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
