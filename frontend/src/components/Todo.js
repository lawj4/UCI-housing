import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";


// function isImgurLink(url) {
//     const imgurRegex = /^(https?:\/\/)?(www\.)?imgur\.com\/(gallery|a)?\/?[a-zA-Z0-9-]+$/;
//     return imgurRegex.test(url);
// }
function isFacebookPostLink(url) {
    const regex = /^https:\/\/www\.facebook\.com\/groups\/[a-zA-Z0-9.-]+\/permalink\/\d+\/?$/;
    return regex.test(url);
  }

function Todo() {
    const [todoList, setTodoList] = useState([]);
    const [editableId, setEditableId] = useState(null);

    const [editedGender, setEditedGender] = useState("");
    const [editedOccupancy, setEditedOccupancy] = useState("");
    const [editedDistance, setEditedDistance] = useState("");
    const [editedRent, setEditedRent] = useState("");
    const [editedStart, setEditedStart] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");
    const [editedImage, setEditedImage] = useState("");


    const [newGender, setNewGender] = useState("");
    const [newOccupancy, setNewOccupancy] = useState("");
    const [newDistance, setNewDistance] = useState("");
    const [newRent, setNewRent] = useState("");
    const [newStart, setNewStart] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [newImage, setNewImage] = useState("");
    
    const [query, setQuery] = useState('');

    // Fetch tasks from database
    useEffect(() => {
        axios.get('http://127.0.0.1:3001/getTodoList')
            .then(result => {
                setTodoList(result.data)
            })
            .catch(err => console.log(err))
    }, [])

    // Function to toggle the editable state for a specific row
    const toggleEditable = (id) => {
        const rowData = todoList.find((data) => data._id === id);
        if (rowData) {
            setEditableId(id);
            setEditedGender(rowData.gender);
            setEditedOccupancy(rowData.occupancy);
            setEditedDistance(rowData.distance);
            setEditedRent(rowData.rent);
            setEditedDeadline(rowData.deadline || "");
            setEditedImage(rowData.image);
        } else {
            setEditableId(null);
            setEditedGender("");
            setEditedOccupancy("");
            setEditedDistance("");
            setEditedRent("");
            setEditedStart("");
            setEditedDeadline("");
            setEditedImage("");
        }
    };


    // Function to add Distance to the database
    const addTask = (e) => {
        e.preventDefault();
        if (new Date(newStart) > new Date(newDeadline)) {
            alert("At least make up an end date bruh")
            return;
        }
        if (!isFacebookPostLink(newImage)) {
            alert("That is not a valid Facebook link")
            return;
        }
        if (!newGender || !newOccupancy || !newDistance || !newRent || !newDeadline || !newImage) {
            alert("All fields must be filled out.");
            return;
        }

        axios.post('http://127.0.0.1:3001/addTodoList', {gender: newGender, occupancy: newOccupancy, distance: newDistance, rent: newRent, start: newStart, deadline: newDeadline, image: newImage})
            .then(res => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    // Function to save edited data to the database
    const saveEditedTask = (id) => {
        const editedData = {
            gender: editedGender,
            occupancy: editedOccupancy,
            distance: editedDistance,
            rent: editedRent,
            start: editedStart,
            deadline: editedDeadline,
            image: editedImage,
            
        };

        // If the fields are empty
        if (!editedImage || !editedGender || !editedOccupancy || !editedDistance || !editedRent || !editedDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        // Updating edited data to the database through updateById API
        axios.post('http://127.0.0.1:3001/updateTodoList/' + id, editedData)
            .then(result => {
                console.log(result);
                setEditableId(null);
                setEditedGender("");
                setEditedOccupancy("");
                setEditedDistance("");
                setEditedRent("");
                setEditedStart("");
                setEditedDeadline("");

                setEditedImage(null);
                 // Clear the edited deadline
                window.location.reload();
            })
            .catch(err => console.log(err));
    }
    

    // async function verifyContent(id, url) {
    //     try {
    //         const response = await axios.post('http://localhost:3001/verify-content', {
    //             url: url,
    //             selector: '#contentSelector',
    //             expectedText: 'Expected Text',
    //         });
    
    //         if (response.data.isContentValid) {
    //             console.log('Content verification successful');
    //             return true;
    //         } else {
    //             alert('It appears that post has been deleted. Reloading...');
    //             deleteTask(id)
    //             return false;
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         return false;
    //     }
    // }


    function verifyContent(id, url) {
        return axios.post('http://localhost:3001/verify-content', {
            url: url,
            selector: '#contentSelector',
            expectedText: 'Expected Text',
        })
        .then(function(response) {
            if (response.data.isContentValid) {
                console.log('Content verification successful');
            } else {
                deleteFailedPost(id);
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
    }
    
    function showPersistentAlert(text) {
        // Create the modal container
        const modal = document.createElement('div');
        modal.id = 'persistentAlert';
        modal.style.position = 'fixed';
        modal.style.top = '20%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.border = '2px solid black';
        modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        modal.style.zIndex = '1000';
        
        // Create the modal content
        const message = document.createElement('p');
        message.textContent = text;
        modal.appendChild(message);
        
        // Create the dismiss button
        const dismissButton = document.createElement('button');
        dismissButton.textContent = 'x';
        dismissButton.onclick = function() {
            document.body.removeChild(modal);
        };
        modal.appendChild(dismissButton);
    
        // Append the modal to the body
        document.body.appendChild(modal);
    }
    function updateLink(id, url) {
        verifyContent(id, url);
    }
    // Delete task from database
    const deleteTask = (id) => {
        axios.delete('http://127.0.0.1:3001/deleteTodoList/' + id)
            .then(result => {
                console.log(result);
                window.location.reload();
            })
            .catch(err =>
                console.log(err)
            )
    }

    const deleteFailedPost = (id) => {
        axios.delete('http://127.0.0.1:3001/deleteTodoList/' + id)
            .then(result => {
                console.log(result);
                
            })
            .catch(err =>
                console.log(err)
            )
            showPersistentAlert("Sorry! It appears that post was deleted. It will be removed upon refresh.");
    }

  // Split the query into multiple words and filter data based on those words
  const filteredData = todoList.filter(item => {
    const words = query.split(' ').map(word => word.trim().toLowerCase()).filter(word => word.length > 0);
    console.log(words)
    const gender = words[0]
    const occupancy = words[1]
    const distance = words[2]
    const rent = words[3]
    const searchAny = [undefined, "any", "x", "all"]
    const matchesQuery = (
        (searchAny.includes(gender) || item.gender.toLowerCase() === gender) &&
        (searchAny.includes(occupancy) || item.occupancy.toLowerCase() === occupancy) &&
        (searchAny.includes(distance) || Number(item.distance) <= Number(distance)) &&
        (searchAny.includes(rent) || Number(item.rent) <= Number(rent))
      );
    return matchesQuery;
  });

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-7">
                    <h2 className="text-center">Listings</h2>
                    <input
                        type="text"
                        value={query}
                        className="searchBar"
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search male any 12 1200"
                    />
                    <div className="table-responsive">
                        <table id="myTable" className="table table-bordered">
                            <thead className="table-primary">
                                <tr>
                                    <th>Gender</th>
                                    
                                    
                                    <th>Occupancy</th>
                                    <th>Distance</th>
                                    <th>Rent</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Facebook</th>
                                    
                                </tr>
                            </thead>
                            {Array.isArray(todoList) ? (
                                <tbody>
                                    {filteredData.map((data) => (
                                        <tr key={data._id}>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editedGender}
                                                        onChange={(e) => setEditedGender(e.target.value)}
                                                    />
                                                ) : (
                                                    data.gender
                                                )}
                                            </td>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editedOccupancy}
                                                        onChange={(e) => setEditedOccupancy(e.target.value)}
                                                    />
                                                ) : (
                                                    data.occupancy
                                                )}
                                            </td>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={editedDistance}
                                                        onChange={(e) => setEditedDistance(e.target.value)}
                                                    />
                                                ) : (
                                                    data.distance
                                                )}
                                            </td>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={editedRent}
                                                        onChange={(e) => setEditedRent(e.target.value)}
                                                    />
                                                ) : (
                                                    data.rent
                                                )}
                                            </td>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={editedStart}
                                                        onChange={(e) => setEditedDeadline(e.target.value)}
                                                    />
                                                ) : (
                                                    data.start ? new Date(data.start).toLocaleDateString() : ''
                                                )}
                                            </td>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={editedDeadline}
                                                        onChange={(e) => setEditedDeadline(e.target.value)}
                                                    />
                                                ) : (
                                                    data.deadline ? new Date(data.deadline).toLocaleDateString() : ''
                                                )}
                                            </td>
                                            <td>
                                                <a 
                                                    href={data.image} 
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => {
                                                        updateLink(data._id, data.image); // Call your function
                                                    }}
                                                >
                                                    Link
                                                </a>
                                                
                                            </td>
                                            <td>
                                                {editableId === data._id ? (
                                                    <button className="btn btn-success btn-sm" onClick={() => saveEditedTask(data._id)}>
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button className="btn btn-primary btn-sm" onClick={() => toggleEditable(data._id)}>
                                                        Edit
                                                    </button>
                                                )}
                                                <button className="btn btn-danger btn-sm ml-1" onClick={() => deleteTask(data._id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            ) : (
                                <tbody>
                                    <tr>
                                        <td colSpan="4">Loading products...</td>
                                    </tr>
                                </tbody>
                            )}


                        </table>
                    </div>
                </div>
                <div className="col-md-5">
                    <h2 className="text-center">Add</h2>
                    <form className="bg-light p-4">
                        <div className="mb-3">
                            <label>Gender</label>
                            <select className="form-control"
                                type="text"
                                placeholder="Enter Gender"
                                defaultValue = "default"
                                onChange={(e) => setNewGender(e.target.value)}>
                                <option value="default" disabled>select</option>
                                <option value="coed">coed</option>
                                <option value="male">male</option>
                                <option value="female">female</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label>Occupancy</label>
                            <select className="form-control"
                                type="text"
                                selected="Enter Occupancy"
                                defaultValue="default"
                                onChange={(e) => setNewOccupancy(e.target.value)}>
                                <option value="default" disabled>select</option>
                                <option value="single">single</option>
                                <option value="double">double</option>
                                <option value="triple">triple</option>
                                <option value="quintuple">quintuple</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label>Distance</label>
                            <input
                                className="form-control"
                                type="number"
                                placeholder="miles to Aldrich via car"
                                onChange={(e) => setNewDistance(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Rent</label>
                            <input
                                className="form-control"
                                type="number"
                                placeholder="monthly payment"
                                onChange={(e) => setNewRent(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Start Date</label>
                            <input
                                className="form-control"
                                type="date"
                                onChange={(e) => setNewStart(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>End Date</label>
                            <input
                                className="form-control"
                                type="date"
                                onChange={(e) => setNewDeadline(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Facebook PUBLIC Post Link</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Listings will be deleted after Facebook post is deleted"
                                onChange={(e) => setNewImage(e.target.value)}
                            />
                        </div>


                        
                        <button onClick={addTask} className="btn btn-success btn-sm">
                            Submit Listing
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}
export default Todo;

