import React, { useState } from 'react';
import formConfig from './formConfig.json';
import { FormField } from './types';
import { useNavigate } from 'react-router-dom';

const DynamicForm: React.FC = () => {
    const [formData, setFormData] = useState<Record<string, string>>(() => {
        const initialData: Record<string, string> = {};
        formConfig.fields.forEach((field: { value: string; id: string | number }) => {
            if (field.value) {
                initialData[field.id] = field.value;
            }
        });
        return initialData;
    });

    const navigate = useNavigate();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        field: FormField
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field.id]: e.target.value,
        }));
    };

    const renderField = (field: FormField) => {
        const commonInputClasses =
            "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 bg-gray-50";
        return (
            <div key={field.id} className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                {field.type === 'text' && (
                    <input
                        type="text"
                        className={commonInputClasses}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(e, field)}
                        required={field.required}
                    />
                )}
                {field.type === 'email' && (
                    <input
                        type="email"
                        className={commonInputClasses}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(e, field)}
                        required={field.required}
                        placeholder='a@gmail.com'
                    />
                )}
                {field.type === 'phone' && (
                    <input
                        type="tel"
                        className={commonInputClasses}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(e, field)}
                        pattern="[0-9]{10}"
                        placeholder="1234567890"
                    />
                )}
                {field.type === 'dropdown' && (
                    <select
                        className={commonInputClasses}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(e, field)}
                        required={field.required}
                    >
                        {field.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                )}
                {field.type === 'textarea' && (
                    <textarea
                        className={`${commonInputClasses} h-32`}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(e, field)}
                        required={field.required}
                    />
                )}
            </div>
        );
    };

    const renderNameField = (field: FormField) => {
        if (!field.nameType) return null;

        switch (field.nameType) {
            case 'fullName':
                return (
                    <div key={field.id} className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 bg-gray-50"
                            value={formData[field.id] || ''}
                            onChange={(e) =>
                                setFormData((prev) => {
                                    const nameParts = e.target.value.split(' ');
                                    return {
                                        ...prev,
                                        firstName: nameParts[0] || '',
                                        lastName: nameParts.slice(1).join(' ') || '',
                                        fullName: e.target.value,
                                    };
                                })
                            }
                            required={field.required}
                            placeholder="Enter Full Name"
                        />
                    </div>
                );
            case 'firstName':
                return (
                    <div key={field.id} className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 bg-gray-50"
                            value={formData[field.id] || ''}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    firstName: e.target.value,
                                }))
                            }
                            required={field.required}
                            placeholder="First Name"
                        />
                    </div>
                );
            case 'lastName':
                return (
                    <div key={field.id} className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 bg-gray-50"
                            value={formData[field.id] || ''}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    lastName: e.target.value,
                                }))
                            }
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
        console.log('Form Data:', formData);
        navigate('/success');
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{formConfig.title}</h1>
            <form onSubmit={handleSubmit}>
                {formConfig.fields.map((field: any) => renderField(field))}
                <div className="flex justify-end mt-8">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};



export default DynamicForm;
