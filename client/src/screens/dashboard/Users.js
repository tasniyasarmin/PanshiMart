import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import ScreenHeader from "../../components/ScreenHeader";
import Wrapper from "./Wrapper";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../store/services/authService";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../../store/reducers/globalReducer";
import AppImage from "../../components/common/AppImage";
import Swal from "sweetalert2"; // Import SweetAlert2

const Users = () => {
  let { page } = useParams();
  if (!page) page = 1;

  const navigate = useNavigate(); // Initialize navigation hook

  // default to object (not array) because API returns an object with users, perPage, count
  const { data = {}, isFetching } = useGetUsersQuery(page);

  const [users, setUsers] = useState([]);

  const { success } = useSelector((state) => state.globalReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearMessage());
    }
  }, [success, dispatch]);

  useEffect(() => {
    const incoming = Array.isArray(data?.users) ? data.users : [];
    const filtered = incoming.filter((u) => !u.admin);

    const same =
      users.length === filtered.length &&
      users.every((u, i) => u && filtered[i] && u._id === filtered[i]._id);

    if (!same) {
      setUsers(filtered);
    }
  }, [data?.users]);

  const [delUser] = useDeleteUserMutation();

  // SweetAlert for Delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      // 1. Disable default SweetAlert styles
      buttonsStyling: false,
      // 2. Apply Tailwind classes directly
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-lg mx-2 transition-all",
        cancelButton:
          "bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-5 rounded-lg mx-2 transition-all",
        popup: "bg-gray-900 text-white border border-gray-700 rounded-xl", // Optional: Makes the modal dark mode to match your theme
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        delUser(id);
        Swal.fire({
          title: "Deleted!",
          text: "User has been deleted.",
          icon: "success",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all",
            popup: "bg-gray-900 text-white border border-gray-700 rounded-xl",
          },
        });
      }
    });
  };

  // SweetAlert for Edit (Update)
  const handleEdit = (id) => {
    Swal.fire({
      title: "Edit User?",
      text: "You are about to modify this user's details.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, edit user!",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-5 rounded-lg mx-2 transition-all",
        cancelButton:
          "bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-5 rounded-lg mx-2 transition-all",
        popup: "bg-gray-900 text-white border border-gray-700 rounded-xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/dashboard/user-edit/${id}`);
      }
    });
  };

  return (
    <Wrapper>
      <ScreenHeader>Users</ScreenHeader>

      {!isFetching ? (
        users.length > 0 ? (
          <div>
            <div className="overflow-x-auto">
              <table className="dashboard-table">
                <thead>
                  <tr className="dashboard-tr">
                    <th className="dashboard-th">Name</th>
                    <th className="dashboard-th">Email</th>
                    <th className="dashboard-th">Role</th>
                    <th className="dashboard-th">Avatar</th>
                    <th className="dashboard-th">Joined</th>
                    <th className="dashboard-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="dashboard-td">{user.name}</td>
                      <td className="dashboard-td">{user.email}</td>
                      <td className="dashboard-td">{user.admin || "user"}</td>
                      <td className="dashboard-td">
                        <AppImage
                          src={user.image}
                          alt={user.name}
                          className="w-[35px] h-[35px] md:w-[50px] md:h-[50px] rounded-full object-cover"
                        />
                      </td>

                      <td className="dashboard-td">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="dashboard-td">
                        {/* Edit Button with SweetAlert */}
                        <button
                          onClick={() => handleEdit(user._id)}
                          className="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-xs font-bold px-2 py-1 rounded text-white transition-colors"
                        >
                          Edit
                        </button>

                        {/* Delete Button with SweetAlert */}
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="btn btn-sm bg-red-500 hover:bg-red-600 text-xs font-bold px-2 py-1 rounded ml-2 text-white transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={parseInt(page)}
              perPage={data?.perPage}
              count={data?.count}
              path="dashboard/users"
            />
          </div>
        ) : (
          "No users!"
        )
      ) : (
        <Spinner />
      )}
    </Wrapper>
  );
};

export default Users;
