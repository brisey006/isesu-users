import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    displayImage: {
        original: String,
        thumbnail: String
    },
    password: {
        type: String,
        required: true
    },
    hashId: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

UserSchema.plugin(mongoosePaginate);
const User = mongoose.model('User', UserSchema);

export default User;