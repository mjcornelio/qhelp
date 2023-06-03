import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useValue } from "../../context/ContextProvider";

import { CONFIG } from "../../config/config";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { MdAdd, MdDeleteOutline, MdModeEdit } from "react-icons/md";

function Users() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const {
    state: { currentUser },
  } = useValue();
  const navigate = useNavigate();
  const fetchUsers = async () => {
    setPageLoading(true);
    fetch(CONFIG.API_URL + "/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    })
      .then(async function (response) {
        const res = await response.json();
        if (res.success) {
          setUsers(res.users);
          setPageLoading(false);
        } else {
          setPageLoading(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        setPageLoading(false);
      });
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  // form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name: e.target.name.value,
      user_role: e.target.role.value,
      username: e.target.username.value,
      password: e.target.password.value,
    };
    setPageLoading(true);
    fetch(CONFIG.API_URL + "/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(user),
    })
      .then(async function (response) {
        const res = await response.json();
        if (res.success) {
          setAddNew(false);
          setPageLoading(false);
          fetchUsers();
        } else {
          setAddNew(false);
          setPageLoading(false);
          setTimeout(() => {}, 5000);
        }
      })
      .catch(function (error) {
        console.log(error);
        setAddNew(false);
        setPageLoading(false);
      });
  };
  //handle User Deletion
  const handleDelete = (e) => {
    e.preventDefault();
    setPageLoading(true);
    const user = {
      id: userToDelete,
    };
    fetch(CONFIG.API_URL + "/api/users/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(user),
    })
      .then(async function (response) {
        const res = await response.json();
        if (res.success) {
          setUserToDelete(null);
          setPageLoading(false);
          fetchUsers();
        } else {
          setUserToDelete(null);
          setPageLoading(false);
          setTimeout(() => {}, 5000);
        }
      })
      .catch(function (error) {
        console.log(error);
        setUserToDelete(null);
        setPageLoading(false);
      });
  };
  //handle User Edit
  const handleEdit = (e) => {
    e.preventDefault();
    const user = {
      id: userToEdit.id,
      name: e.target.name.value,
      user_role: e.target.role.value,
      username: e.target.username.value,
      password: e.target.password.value,
    };
    fetch(CONFIG.API_URL + "/api/users/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(user),
    })
      .then(async function (response) {
        const res = await response.json();
        if (res.success) {
          setUserToEdit(null);
          setPageLoading(false);
          fetchUsers();
        } else {
          setUserToEdit(null);
          setPageLoading(false);
          setTimeout(() => {}, 5000);
        }
      })
      .catch(function (error) {
        console.log(error);
        setUserToEdit(null);
        setPageLoading(false);
      });
  };
  return (
    <div className="flex h-screen overflow-hidden w-screen">
      {currentUser.user_role === "admin" ? (
        <>
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Content area */}
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/*  Site header */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <main>
              {/* Add New User */}
              {addNew && (
                <>
                  <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                    <div
                      className="relative w-auto my-6 mx-auto"
                      style={{ width: "400px" }}
                    >
                      {/*content*/}
                      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                          <h3 className="text-slate-800 font-bold text-xl">
                            New User
                          </h3>
                          <button onClick={() => setAddNew(false)}>
                            <span className=" text-slate-800  h-6 w-6 text-2xl block outline-none hover:opacity-50">
                              ×
                            </span>
                          </button>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto ">
                          <form autoComplete="off" onSubmit={handleSubmit}>
                            <label
                              htmlFor="name"
                              className="text-slate-800 font-semibold text-sm "
                            >
                              Full Name:
                            </label>
                            <input
                              className=" lg:px-5 md:p-2 w-full text-sm border-2 border-sky-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none my-2 block "
                              id="name"
                              type="text"
                              required
                            ></input>
                            <label
                              htmlFor="role"
                              className="text-slate-800 font-semibold text-sm "
                            >
                              Role:
                            </label>
                            <select
                              className=" lg:px-5 md:p-2 w-full text-sm border-2 border-sky-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none mb-2 block"
                              id="role"
                              required
                            >
                              <option defaultValue></option>
                              <option value="staff">Staff</option>
                              <option value="agent">Agent</option>
                              <option value="admin">Admin</option>
                            </select>
                            <label
                              htmlFor="username"
                              className="text-slate-800 font-semibold text-sm "
                            >
                              Username:
                            </label>
                            <input
                              className=" lg:px-5 md:p-2 w-full text-sm border-2 border-sky-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none my-2 block "
                              id="username"
                              type="text"
                              required
                            ></input>
                            <label
                              htmlFor="password"
                              className="text-slate-800 font-semibold text-sm "
                            >
                              Password:
                            </label>
                            <input
                              className=" lg:px-5 md:p-2 w-full text-sm border-2 border-sky-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none my-2 block "
                              id="password"
                              type="text"
                              required
                            ></input>
                            {/*footer*/}
                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                              <button
                                className="text-red-900 px-4 py-2 rounded-lg 
                        font-semibold text-sm hover:text-red-400 transition-all mr-2"
                                type="button"
                                onClick={() => setAddNew(false)}
                              >
                                Close
                              </button>
                              <button
                                className="text-sky-100  px-4 py-2 rounded-lg 
                        font-semibold text-sm bg-indigo-600 hover:opacity-80  transition-all disabled:opacity-50"
                                type="submit"
                              >
                                Save
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
              )}
              {/* Delete User */}
              {userToDelete && (
                <>
                  <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                    <div
                      className="relative w-auto my-6 mx-auto"
                      style={{ width: "400px" }}
                    >
                      {/*content*/}
                      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                          <h3 className="text-slate-800 font-bold text-xl">
                            Delete User
                          </h3>
                          <button onClick={() => setUserToDelete(null)}>
                            <span className=" text-slate-800  h-6 w-6 text-2xl block outline-none hover:opacity-50">
                              ×
                            </span>
                          </button>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto ">
                          <div className="flex items-center flex flex-col">
                            <object
                              data="/illustrations/undraw_throw_away.svg"
                              aria-label="illustration"
                              className="m-0 w-1/2"
                            />
                            <p className="text-slate-800 mt-10 text-center text-red-600 text-sm px-8">
                              Are you sure you want to delete this user? This
                              action can't be undone
                            </p>
                          </div>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                          <button
                            className="text-red-900 px-4 py-2 rounded-lg 
                        font-semibold text-sm hover:text-red-400 transition-all mr-2"
                            type="button"
                            onClick={() => setUserToDelete(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="text-sky-100  px-4 py-2 rounded-lg 
                        font-semibold text-sm bg-indigo-600 hover:opacity-80  transition-all disabled:opacity-50"
                            type="button"
                            onClick={handleDelete}
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
              )}
              {/* Edit User */}
              {userToEdit && (
                <>
                  <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                    <div
                      className="relative w-auto my-6 mx-auto"
                      style={{ width: "400px" }}
                    >
                      {/*content*/}
                      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                          <h3 className="text-slate-800 font-bold text-xl">
                            Edit User
                          </h3>
                          <button onClick={() => setUserToEdit(null)}>
                            <span className=" text-slate-800  h-6 w-6 text-2xl block outline-none hover:opacity-50">
                              ×
                            </span>
                          </button>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto ">
                          <form autoComplete="off" onSubmit={handleEdit}>
                            <label
                              htmlFor="name"
                              className="text-slate-800 font-semibold text-sm "
                            >
                              Full Name:
                            </label>
                            <input
                              className=" lg:px-5 md:p-2 w-full text-sm border-2 border-sky-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none my-2 block "
                              id="name"
                              type="text"
                              required
                              defaultValue={userToEdit.name}
                            ></input>
                            <label
                              htmlFor="role"
                              className="text-slate-800 font-semibold text-sm "
                            >
                              Role:
                            </label>
                            <select
                              className=" lg:px-5 md:p-2 w-full text-sm border-2 border-sky-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none mb-2 block"
                              id="role"
                              required
                              defaultValue={userToEdit.user_role}
                            >
                              <option defaultValue></option>
                              <option value="staff">Staff</option>
                              <option value="agent">Agent</option>
                              <option value="admin">Admin</option>
                            </select>
                            <label
                              htmlFor="username"
                              className="text-slate-800 font-semibold text-sm "
                            >
                              Username:
                            </label>
                            <input
                              className=" lg:px-5 md:p-2 w-full text-sm border-2 border-sky-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none my-2 block "
                              id="username"
                              type="text"
                              required
                              defaultValue={userToEdit.username}
                            ></input>
                            <label
                              htmlFor="password"
                              className="text-slate-800 font-semibold text-sm "
                            >
                              Password:
                            </label>
                            <input
                              className=" lg:px-5 md:p-2 w-full text-sm border-2 border-sky-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none my-2 block "
                              id="password"
                              type="text"
                              required
                              defaultValue={userToEdit.password}
                            ></input>
                            {/*footer*/}
                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                              <button
                                className="text-red-900 px-4 py-2 rounded-lg 
                        font-semibold text-sm hover:text-red-400 transition-all mr-2"
                                type="button"
                                onClick={() => setUserToEdit(false)}
                              >
                                Cancel
                              </button>
                              <button
                                className="text-sky-100  px-4 py-2 rounded-lg 
                        font-semibold text-sm bg-indigo-600 hover:opacity-80  transition-all disabled:opacity-50"
                                type="submit"
                              >
                                Save
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
              )}
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                <div className="col-span-full  bg-white shadow-lg rounded-sm border border-slate-200">
                  <header className="px-5 py-4 border-b border-slate-100 flex justify-between">
                    <h2 className="font-semibold text-slate-800">
                      User Accounts
                    </h2>
                    <button
                      className="text-sky-100  px-3 py-2 rounded-md 
                        font-semibold text-xs bg-indigo-500 hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center "
                      type="button"
                      title="Add New User"
                      onClick={() => setAddNew(true)}
                    >
                      <MdAdd className="mr-1 text-lg" /> New User
                    </button>
                  </header>
                  <div className="p-3 ">
                    {/* Table */}
                    <div className="overflow-x-auto">
                      {pageLoading ? (
                        <div className="w-full flex justify-center items-center h-96">
                          <div className="w-full flex justify-center items-center h-96">
                            <div className="inline-block animate-bounce  rounded-full  w-3 h-3 bg-indigo-500 mx-2"></div>
                            <div
                              className="inline-block animate-bounce  rounded-full w-3 h-3 bg-indigo-500 mx-2"
                              style={{ animationDuration: "500ms" }}
                            ></div>
                            <div
                              className="inline-block animate-bounce rounded-full  w-3 h-3 bg-indigo-500 mx-2"
                              style={{ animationDuration: "800ms" }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <table className="table-fixed w-full">
                          {users.length == 0 ? (
                            <tbody className="text-sm font-medium divide-y divide-slate-100">
                              <tr>
                                <td className="p-5">
                                  <div className="flex items-center flex flex-col">
                                    <object
                                      data="/illustrations/undraw_searching.svg"
                                      aria-label="illustration"
                                      className="m-0 w-1/6"
                                    />
                                    <p className="text-slate-800 mt-5">
                                      No Existing Tickets
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          ) : (
                            <>
                              {/* Table header */}
                              <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm">
                                <tr>
                                  <th className="p-4">
                                    <div className="font-semibold text-left">
                                      User Id
                                    </div>
                                  </th>
                                  <th className="p-4">
                                    <div className="font-semibold text-left">
                                      Name
                                    </div>
                                  </th>
                                  <th className="p-4">
                                    <div className="font-semibold text-left">
                                      Role
                                    </div>
                                  </th>
                                  <th className="p-4">
                                    <div className="font-semibold text-left">
                                      Action
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              {/* Table body */}
                              <tbody className="text-sm font-medium divide-y divide-slate-100">
                                {/* Rows */}
                                {users.map((user) => (
                                  <tr
                                    key={user.id}
                                    className="cursor-pointer hover:bg-gray-200"
                                  >
                                    <td className="p-4">
                                      <div className="text-left uppercase font-bold text-md">
                                        #{user.id}
                                      </div>
                                    </td>
                                    <td className="p-4">
                                      <div className="text-left capitalize font-semibold text-sm">
                                        {user.name}
                                      </div>
                                    </td>
                                    <td className="p-4">
                                      <div className="text-left capitalize font-normal text-sm">
                                        {user.user_role}
                                      </div>
                                    </td>
                                    <td className="p-4">
                                      <div className=" font-normal text-xl">
                                        <button
                                          className="mr-10 text-red-500 hover:bg-slate-300 p-2 rounded-full"
                                          title="Delete"
                                          onClick={() =>
                                            setUserToDelete(user.id)
                                          }
                                        >
                                          <MdDeleteOutline />
                                        </button>
                                        <button
                                          className="text-sky-500 hover:bg-slate-300 p-2 rounded-full"
                                          title="Edit"
                                          onClick={() => setUserToEdit(user)}
                                        >
                                          <MdModeEdit />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </>
                          )}
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center w-full">
          <div className="flex items-center flex-col ">
            <object
              data="/illustrations/undraw_access_denied_.svg"
              aria-label="illustration"
              className="m-0 w-1/2"
            />
            <p className="text-red-500 mt-5 font-bold text-3xl">
              Access Denied!
            </p>
            <p className="text-red-400  font-normal text-xl">
              You don't have permission to access this section
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
