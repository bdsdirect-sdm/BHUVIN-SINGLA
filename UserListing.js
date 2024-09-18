import React from 'react';
import './App.css' ;
import { useState, useEffect } from 'react';

const Adduser = () => {

    const[users, setUsers] = useState(["hello"
    ]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        console.log("name",users);
        localStorage.setItem('dataKey', JSON.stringify(users));
      }, [users]);

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('dataKey'));
        if (storedUsers) {
          setUsers(storedUsers);
        }
      }, []);
      
    const[firstName, setFirstName] = useState('');
    const[lastName, setLastName] = useState('');
    const[email, setEmail] = useState('');
    const[phone, setPhone] = useState('');
    const[gender, setGender] = useState('');
    const[dob, setdob] = useState('');
    

    function handleFirstNamechange(write) {
        setFirstName(write.target.value);
    }
    function handleLastNamechange(write) {
        setLastName(write.target.value);
    }
    function handleEmailchange(write) {
        setEmail(write.target.value);
    }
    function handlePhonechange(write) {
        setPhone(write.target.value);
    }
    function handleGenderchange(write){
        setGender(write.target.value);
    }
    function handledobchange(write){
        setdob(write.target.value);
    }

    const validateForm = () => {
        const errors = {};
        if (!firstName) {
          errors.firstName = 'required';
        }
        if (!lastName) {
          errors.lastName = 'required';
        }
        if (!email) {
          errors.email = 'required';
        } else if (!isValidEmail(email)) {
          errors.email = 'invalid email';
        }
        if (!phone) {
          errors.phone = 'required';
        } else if (isNaN(phone)) {
          errors.phone = 'invalid phone number';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
      };
    
      const isValidEmail = (email) => {
        const requirementsEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return requirementsEmail.test(email);
      };

    function printValues(wait) {
        wait.preventDefault();

        if(!validateForm()) {
            alert('Please fill out all required fields');}

        else{

        

        setUsers((prevUsers) => [...prevUsers, { firstName, lastName,email,phone, gender ,dob ,currentDate , currentTime}]);
        {users.map((user, index) => {
            return (
                <tr key={index}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.gender}</td>
                    <td>{user.dob}</td> <tr>
                        <th>First Name:</th>
                        <td><input type='text' onChange={handleFirstNamechange} value={firstName} />
                        {errors.firstName && <p>{errors.firstName}</p>}
                        </td>
                        <th>Last Name:</th>
                        <td><input type='text' onChange={handleLastNamechange} value={lastName} />
                        {errors.lastName && <p>{errors.lastName}</p>}</td>
                    </tr>
                    <tr>
                        <th>Email:</th>
                        <td><input type='email' onChange={handleEmailchange} value={email} />
                        {errors.email && <p>{errors.email}</p>}
                        </td>
                        <th>Phone no.:</th>
                        <td><input type='number' onChange={handlePhonechange} value={phone} />
                        {errors.phone && <p>{errors.phone}</p>}
                        </td>
                    </tr>
                    <td>{user.currentDate}</td>
                    <td>{user.currentTime}</td>
                    <td><button onClick={() => remove(index)}>Remove</button></td>
                    <td><button>Edit</button></td>
                </tr>
                
            )
        })
        }
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setdob('');
}
        
    }
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() +1;
    const date_today = today.getDate() -1;

    const currentDate = date_today + "/" + month + "/" + year ;
    
    const hour = today.getHours() + 1;
    const minute = today.getMinutes();
    const second = today.getSeconds();
    const currentTime = hour + ":" + minute + ":" + second ;
    
    const remove = (id) => {
        setUsers(users.filter((user, index) => index !== id));
    };

    

    return (
        <div>
            <hr></hr><hr></hr>
            <form>
                <table>
                    <tr>
                        <th>First Name:</th>
                        <td><input type='text' onChange={handleFirstNamechange} value={firstName} validation={{
                            required: {
                                value:true,
                                message:'required',
                            },
                        }} required /></td>
                        <th>Last Name:</th>
                        <td><input type='text' onChange={handleLastNamechange} value={lastName} /></td>
                    </tr>
                    <tr>
                        <th>Email:</th>
                        <td><input type='email' onChange={handleEmailchange} value={email} /></td>
                        <th>Phone no.:</th>
                        <td><input type='number' onChange={handlePhonechange} value={phone} /></td>
                    </tr>
                    <tr>
                        <th>Gender:</th>
                        <td>
                            <select value={gender} onChange={handleGenderchange} >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </td>
                        <th>D.O.B.</th>
                        <td><input type='date' value={dob} onChange={handledobchange} /></td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td>
                            <input type='radio' name="status" />Active<br />
                            <input type='radio' name='status' />Not active
                            
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="4">
                            
                            <button onClick={printValues}>Submit</button>
                        </td>	
                    </tr>

                </table>
            </form>
            <hr></hr><hr></hr>

            <table border={1}>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone number</th>
                    <th>Gender</th>
                    <th>D.O.B.</th>
                    <th>Created At<br /> (Date)</th>
                    <th>Created At<br /> (Time)</th>
                    <th>&#10060;</th>
                    <th>Edit</th>
                </tr>
                {users.map((user, index) => {
                    return (
                        <tr key={index}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.gender}</td>
                            <td>{user.dob}</td>
                            <td>{user.currentDate}</td>
                            <td>{user.currentTime}</td>
                            <td><button onClick={() => remove(index)}>Remove</button></td>
                            <td><button  >Edit</button></td>
                        </tr>
                        
                    )
                })
                }
                
            </table>
            
        </div>
    );
}

export default Adduser;