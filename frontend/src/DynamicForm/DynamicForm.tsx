import React, { useState } from 'react';
import formConfig from './formConfig.json';
import { FormField } from './types';
import { useNavigate } from 'react-router-dom';
// import './DynamicForm.css';

const DynamicForm: React.FC = () => {
    const [formData, setFormData] = useState<Record<string, string>>(() => {
        const initialData: Record<string, string> = {};
        formConfig.fields.forEach((field: { value: string; id: string | number; }) => {
            if (field.value) {
                initialData[field.id] = field.value;
            }
        });
        return initialData;
    });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, field: FormField) => {
        setFormData(prev => ({
            ...prev,
            [field.id]: e.target.value
        }));
    };

    const renderField = (field: FormField) => {
        switch (field.type) {
            case 'name':
                return renderNameField(field);
            case 'text':
                return (
                    <div key={field.id}>
                        <label>{field.label}</label>
                        <input
                            type="text"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(e, field)}
                            required={field.required}
                        />
                    </div>
                );
            case 'email':
                return (
                    <div key={field.id}>
                        <label>{field.label}</label>
                        <input
                            type="email"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(e, field)}
                            required={field.required}
                        />
                    </div>
                );
            case 'phone':
                return (
                    <div key={field.id}>
                        <label>{field.label}</label>
                        <input
                            type="tel"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(e, field)}
                            pattern="[0-9]{10}"
                        />
                    </div>
                );
            case 'dropdown':
                return (
                    <div key={field.id}>
                        <label>{field.label}</label>
                        <select
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(e, field)}
                            required={field.required}
                        >
                            {field.options?.map((option: any | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.Key | null | undefined) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                );
            case 'textarea':
                return (
                    <div key={field.id}>
                        <label>{field.label}</label>
                        <textarea
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(e, field)}
                            required={field.required}
                        />
                    </div>
                );
            case 'password':
                return (
                    <div key={field.id}>
                        <label>{field.label}</label>
                        <input
                            type="password"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(e, field)}
                            required={field.required}
                        />
                    </div>
                );
            case 'number':
                return (
                    <div key={field.id}>
                        <label>{field.label}</label>
                        <input
                            type="number"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(e, field)}
                            required={field.required}
                        />
                    </div>
                );
            case 'radio':
                return (
                    <div key={field.id}>
                        <label>{field.label}</label>
                        {field.options?.map((option: string) => (
                            <div key={option}>
                                <input
                                    type="radio"
                                    name={field.id}
                                    value={option}
                                    checked={formData[field.id] === option}
                                    onChange={(e) => handleChange(e, field)}
                                    required={field.required}
                                />
                                {option}
                            </div>
                        ))}
                    </div>
                );
            case 'checkbox':
                return (
                    <div key={field.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData[field.id] === "true"}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    [field.id]: e.target.checked ? "true" : "false"
                                }))}
                                required={field.required}
                            />
                            {field.label}
                        </label>
                    </div>
                );
            case 'url':
                return (
                    <div key={field.id}>
                        <label>{field.label}</label>
                        <input
                            type="url"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(e, field)}
                        />
                    </div>
                );
            case 'date':
                return (
                    <div key={field.id}>
                        <label>{field.label}</label>
                        <input
                            type="date"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(e, field)}
                            required={field.required}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const renderNameField = (field: FormField) => {
        if (!field.nameType) return null;

        switch (field.nameType) {
            case 'fullName':
                return (
                    <div key={field.id}>
                        <label>{field.label}</label>
                        <input
                            type="text"
                            value={formData[field.id] || ''}
                            onChange={(e) => setFormData(prev => {
                                const nameParts = e.target.value.split(' ');
                                return {
                                    ...prev,
                                    firstName: nameParts[0] || '',
                                    lastName: nameParts.slice(1).join(' ') || '',
                                    fullName: e.target.value
                                };
                            })}
                            required={field.required}
                            placeholder="Enter Full Name"
                        />
                    </div>
                );
            case 'firstName':
                return (
                    <div key={field.id}>
                        <label>{field.label}</label>
                        <input
                            type="text"
                            value={formData[field.id] || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                firstName: e.target.value
                            }))}
                            required={field.required}
                            placeholder="First Name"
                        />
                    </div>
                );
            case 'lastName':
                return (
                    <div key={field.id}>
                        <label>{field.label}</label>
                        <input
                            type="text"
                            value={formData[field.id] || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                lastName: e.target.value
                            }))}
                            required={field.required}
                            placeholder="Last Name"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/success");
        console.log('Form Data:', formData);
    };

    return (
        <div>
            <h1>{formConfig.title}</h1>
            <form onSubmit={handleSubmit}>
                {formConfig.fields.map((field: any, _index: any) => renderField(field))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default DynamicForm;

// import React, { useState } from 'react';
// import formConfig from './formConfig.json';
// import { FormField } from './types';
// import { useNavigate } from 'react-router-dom';

// const DynamicForm: React.FC = () => {
//     const [formData, setFormData] = useState<Record<string, string>>(() => {
//         const initialData: Record<string, string> = {};
//         formConfig.fields.forEach((field: { value: string; id: string | number }) => {
//             if (field.value) {
//                 initialData[field.id] = field.value;
//             }
//         });
//         return initialData;
//     });

//     const navigate = useNavigate();

//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
//         field: FormField
//     ) => {
//         setFormData((prev) => ({
//             ...prev,
//             [field.id]: e.target.value,
//         }));
//     };

//     const renderField = (field: FormField) => {
//         const commonInputClasses =
//             "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 bg-gray-50";
//         return (
//             <div key={field.id} className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
//                 {field.type === 'text' && (
//                     <input
//                         type="text"
//                         className={commonInputClasses}
//                         value={formData[field.id] || ''}
//                         onChange={(e) => handleChange(e, field)}
//                         required={field.required}
//                     />
//                 )}
//                 {field.type === 'email' && (
//                     <input
//                         type="email"
//                         className={commonInputClasses}
//                         value={formData[field.id] || ''}
//                         onChange={(e) => handleChange(e, field)}
//                         required={field.required}
//                         placeholder='a@gmail.com'
//                     />
//                 )}
//                 {field.type === 'phone' && (
//                     <input
//                         type="tel"
//                         className={commonInputClasses}
//                         value={formData[field.id] || ''}
//                         onChange={(e) => handleChange(e, field)}
//                         pattern="[0-9]{10}"
//                         placeholder="1234567890"
//                     />
//                 )}
//                 {field.type === 'dropdown' && (
//                     <select
//                         className={commonInputClasses}
//                         value={formData[field.id] || ''}
//                         onChange={(e) => handleChange(e, field)}
//                         required={field.required}
//                     >
//                         {field.options?.map((option) => (
//                             <option key={option} value={option}>
//                                 {option}
//                             </option>
//                         ))}
//                     </select>
//                 )}
//                 {field.type === 'textarea' && (
//                     <textarea
//                         className={`${commonInputClasses} h-32`}
//                         value={formData[field.id] || ''}
//                         onChange={(e) => handleChange(e, field)}
//                         required={field.required}
//                     />
//                 )}
//             </div>
//         );
//     };

//     const renderNameField = (field: FormField) => {
//         if (!field.nameType) return null;

//         switch (field.nameType) {
//             case 'fullName':
//                 return (
//                     <div key={field.id} className="mb-6">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             {field.label}
//                         </label>
//                         <input
//                             type="text"
//                             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 bg-gray-50"
//                             value={formData[field.id] || ''}
//                             onChange={(e) =>
//                                 setFormData((prev) => {
//                                     const nameParts = e.target.value.split(' ');
//                                     return {
//                                         ...prev,
//                                         firstName: nameParts[0] || '',
//                                         lastName: nameParts.slice(1).join(' ') || '',
//                                         fullName: e.target.value,
//                                     };
//                                 })
//                             }
//                             required={field.required}
//                             placeholder="Enter Full Name"
//                         />
//                     </div>
//                 );
//             case 'firstName':
//                 return (
//                     <div key={field.id} className="mb-6">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             {field.label}
//                         </label>
//                         <input
//                             type="text"
//                             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 bg-gray-50"
//                             value={formData[field.id] || ''}
//                             onChange={(e) =>
//                                 setFormData((prev) => ({
//                                     ...prev,
//                                     firstName: e.target.value,
//                                 }))
//                             }
//                             required={field.required}
//                             placeholder="First Name"
//                         />
//                     </div>
//                 );
//             case 'lastName':
//                 return (
//                     <div key={field.id} className="mb-6">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             {field.label}
//                         </label>
//                         <input
//                             type="text"
//                             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 bg-gray-50"
//                             value={formData[field.id] || ''}
//                             onChange={(e) =>
//                                 setFormData((prev) => ({
//                                     ...prev,
//                                     lastName: e.target.value,
//                                 }))
//                             }
//                             required={field.required}
//                             placeholder="Last Name"
//                         />
//                     </div>
//                 );
//             default:
//                 return null;
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         console.log('Form Data:', formData);
//         navigate('/success');
//     };

//     return (
//         <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
//             <h1 className="text-3xl font-bold text-gray-900 mb-6">{formConfig.title}</h1>
//             <form onSubmit={handleSubmit}>
//                 {formConfig.fields.map((field: any) => renderField(field))}
//                 <div className="flex justify-end mt-8">
//                     <button
//                         type="submit"
//                         className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
//                     >
//                         Submit
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };



// export default DynamicForm;
