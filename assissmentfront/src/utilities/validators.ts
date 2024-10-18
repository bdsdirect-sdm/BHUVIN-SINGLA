import * as Yup from "yup"


const SUPPORTED_IMAGE : Array<string> = [ 'image/png', 'image/jpeg', 'image/jpg'];
const  SUPPORTED_FILE : Array<string> = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];

// singup page validation
export const createValidationSchema = () => {
    return (

        Yup.object().shape({
            user_type: Yup.string().required("Please select your role"),
            firstName: Yup.string()
                .required("Please enter your first name")
                .min(3, "Greater than 3 digits"),
            lastName:Yup.lazy((_value, context) =>{
                const {user_type} = context.parent;
                if(user_type === 'Job_Seeker'){
                    return Yup.string().required("Last Name Required")
                }
                return Yup.string().nullable()
            }),
            email: Yup.string().email("Please enter the correct email").required("Please enter your email"),
            phoneNo: Yup.string().required(" Enter Your Contact No.").matches(/^[1-9][0-9]{9}$/, "Must be integer and 10 in length"),
            gender:Yup.string().required("Selct gender"),
            hobbies:Yup.array().of(Yup.string()).min(1,"Select at least one hobby"),
            profile_image : Yup.mixed().required("select profile image")
                .test("fileFormat","only png and jpeg are allowed",(value) => value && SUPPORTED_IMAGE.includes((value as any).type) ),
            resume:Yup.lazy((_value, context) =>{
                const { user_type } = context.parent;
                if (user_type === "Job_Seeker") {
                    return Yup.mixed().required("Select Resume")
                    .test("fileFormat","only PDF and DOCs are allowed",(value) => value && SUPPORTED_FILE.includes((value as any)?.type) )
                }
                return Yup.mixed().nullable();

            }),
            agency:Yup.lazy((_value, context) => {
                const {user_type} = context.parent;
                if(user_type === 'Job_Seeker'){
                    return Yup.string().min(2,"selct agenct").required("Select Agency")
                }
                return Yup.string().nullable()
            }),
        })
    )
}


// Login page validation
export const createLoginSchema = () => {
    return(
        Yup.object().shape({
            email: Yup.string()
              .email('Invalid email format')
              .required('Email is required'),
              
            password: Yup.string()
              .min(8, 'Password must be at least 8 characters')
              .required('Password is required')
          })
    )
}
