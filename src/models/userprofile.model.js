const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define UserDetails Schema
// const userprofileSchema = new Schema(
//     {
//         user: {
//             type: Schema.Types.ObjectId,
//             ref: 'User', // Reference to the User model
//             required: true
//         },

//         professionalSummary: {
//             type: String,
//             trim: true
//         },

//         education: [
//             {
//                 institution: { type: String, required: true, trim: true },
//                 degree: { type: String, required: true, trim: true },
//                 fieldOfStudy: { type: String, trim: true },
//                 startDate: { type: Date, required: true },
//                 endDate: { type: Date },
//                 description: { type: String, trim: true }
//             }
//         ],

//         experience: [
//             {
//                 company: { type: String, required: true, trim: true },
//                 position: { type: String, required: true, trim: true },
//                 startDate: { type: Date, required: true },
//                 endDate: { type: Date },
//                 description: { type: String, trim: true }
//             }
//         ],

//         projects: [
//             {
//                 title: { type: String, required: true, trim: true },
//                 description: { type: String, trim: true },
//                 technologies: [{ type: String, trim: true }],
//                 link: { type: String, trim: true }
//             }
//         ],

//         skills: [
//             {
//                 name: { type: String, required: true, trim: true },
//                 proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' }
//             }
//         ],

//         certifications: [
//             {
//                 title: { type: String, required: true, trim: true },
//                 issuingOrganization: { type: String, trim: true },
//                 issueDate: { type: Date },
//                 expirationDate: { type: Date }
//             }
//         ],

//         references: [
//             {
//                 name: { type: String, required: true, trim: true },
//                 relationship: { type: String, trim: true },
//                 email: { type: String, trim: true },
//                 phone: { type: String, trim: true }
//             }
//         ],

//         languages: [
//             {
//                 language: { type: String, required: true, trim: true },
//                 proficiency: { type: String, enum: ['Basic', 'Conversational', 'Fluent', 'Native'], default: 'Basic' }
//             }
//         ]
//     },
//     {
//         timestamps: true // Adds createdAt and updatedAt
//     }
// );

const userprofileSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
            unique: true
        },

    //   _id:{
    //     type: String,
    //     required: true,
    //     unique: true
    //   },
        professionalSummary: {
            type: String,
            trim: true,
            default: "Not specified" // Default empty string
        },

        education: [
            {
                institution: { type: String, required: true, trim: true, default: "Not specified" },
                degree: { type: String, required: true, trim: true, default: "Not specified" },
                fieldOfStudy: { type: String, trim: true, default: "Not specified" },
                startDate: { type: Date},
                endDate: { type: Date },
                description: { type: String, trim: true, default: "Not specified" }
            }
        ],

        experience: [
            {
                company: { type: String, required: true, trim: true, default: "Not specified" },
                position: { type: String, required: true, trim: true, default: "Not specified" },
                startDate: { type: Date },
                endDate: { type: Date },
                description: { type: String, trim: true, default: "Not specified" }
            }
        ],

        projects: [
            {
                title: { type: String, required: true, trim: true, default: "Not specified" },
                description: { type: String, trim: true, default: "Not specified" },
                technologies: [{ type: String, trim: true, default: "Not specified" }],
                link: { type: String, trim: true, default: "Not specified" }
            }
        ],

        skills: [
            {
                name: { type: String, required: true, trim: true, default: "Not specified" },
                proficiency: {
                    type: String,
                    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                    default: 'Intermediate'
                }
            }
        ],

        certifications: [
            {
                title: { type: String, required: true, trim: true, default: "Not specified" },
                issuingOrganization: { type: String, trim: true, default: "Not specified" },
                issueDate: { type: Date },
                expirationDate: { type: Date }
            }
        ],

        references: [
            {
                name: { type: String, required: true, trim: true, default: "Not specified" },
                relationship: { type: String, trim: true, default: "Not specified" },
                email: { type: String, trim: true, default: "Not specified" },
                phone: { type: String, trim: true, default: "Not specified" }
            }
        ],

        languages: [
            {
                language: { type: String, required: true, trim: true, default: "Not specified" },
                proficiency: {
                    type: String,
                    enum: ['Basic', 'Conversational', 'Fluent', 'Native'],
                    default: 'Basic'
                }
            }
        ]
    },
    {
        timestamps: true // Adds createdAt and updatedAt fields
    }
);


const UserProfile = mongoose.model("UserProfile", userprofileSchema);
module.exports = UserProfile;
