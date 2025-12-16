import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Nav from "../../components/home/Nav";
import Header from "../../components/home/Header";
import AccountList from "../../components/home/AccountList";
import { useVerifyPaymentQuery } from "../../store/services/paymentService";
import { emptyCart } from "../../store/reducers/cartReducer";
import { setUser } from "../../store/reducers/authReducer";
import { useUpdateUserMutation } from "../../store/services/authService";

const Dashboard = () => {
  const { user } = useSelector((state) => state.authReducer);
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  // only run query when there's a sessionId
  const { data, isSuccess, isError, error, isLoading } = useVerifyPaymentQuery(
    sessionId,
    { skip: !sessionId }
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- modal state for editing user ---
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (!sessionId) return; // nothing to do if no session id

    if (isSuccess) {
      // clear client cart and update client state
      try {
        localStorage.removeItem("cart");
      } catch (e) {
        console.warn("localStorage unavailable:", e);
      }

      toast.success(data?.msg || "Payment verified");
      dispatch(emptyCart());

      // remove session_id from URL by navigating to /user (no query)
      navigate("/user", { replace: true });
    }

    if (isError) {
      // show an error toast (helpful during dev)
      const message =
        error?.data?.error ||
        error?.data ||
        error?.message ||
        "Verification failed";
      toast.error(message);
      // optional: navigate to cart or show UI — keep user on dashboard so they can retry
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, data, error, sessionId]);

  return (
    <>
      <Nav />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="mt-[70px]">
        <Header>my account</Header>
        <div className="my-container mt-[40px]">
          <div className="flex flex-wrap -mx-6">
            <div className="w-full md:w-4/12 p-6">
              <AccountList />
            </div>
            <div className="w-full md:w-8/12 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="heading">name</h1>
                  <span className="block mt-3 capitalize font-medium text-sm">
                    {user?.name}
                  </span>
                </div>

                {/* Edit button */}
                <div>
                  <button
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                    onClick={() => setIsEditOpen(true)}
                    aria-label="Edit profile"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* small feedback while verification is happening */}
              {sessionId && isLoading && (
                <p className="mt-4 text-sm text-gray-600">
                  Verifying payment...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal inserted at end of component so portal/stacking is simple */}
      {isEditOpen && (
        <EditUserModal
          initialUser={user ?? { name: "", email: "" }}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </>
  );
};

export default Dashboard;

/**
 * EditUserModal
 *
 * - Uses useUpdateUserMutation (RTK Query). If your service hook has a different name, change import above.
 * - Prefills name & email. Password is optional (only send if provided).
 * - On success: shows toast and closes modal. If you want to permanently update Redux auth state,
 *   dispatch an action here (e.g., dispatch(setUser(updatedUser))) — adjust to match your slice.
 */
function EditUserModal({ initialUser, onClose }) {
  const [name, setName] = useState(initialUser?.name || "");
  const [email, setEmail] = useState(initialUser?.email || "");
  const [password, setPassword] = useState("");
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const dispatch = useDispatch();

  // helper to submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    // Build payload: only include password if provided
    const payload = {
      id: initialUser?._id || initialUser?.id,
      name: name.trim(),
      email: email.trim(),
    };
    if (password.trim()) payload.password = password;

    try {
      const res = await updateUser(payload).unwrap();
      const updatedUser = res?.user ?? res?.data ?? res;
      dispatch(setUser(updatedUser));

      toast.success(res?.msg || "Profile updated");
      onClose();
    } catch (err) {
      // try to pick a useful message from common shapes
      const message =
        err?.data?.error ||
        err?.data?.message ||
        err?.message ||
        "Update failed";
      toast.error(message);
    }
  };

  return (
    // modal backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-lg p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Edit profile</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Close edit profile"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-md px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              New password (optional)
            </label>
            <input
              type="password"
              className="w-full border rounded-md px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
