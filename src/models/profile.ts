import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ProfileSchema = new mongoose.Schema({
    gender: String,
    phoneNumber: String,
    address: String,
    dateOfBirth: Date,
    country: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, unique: true }
}, {
    timestamps: true
});

ProfileSchema.plugin(mongoosePaginate);
const Profile = mongoose.model('Profile', ProfileSchema);

export default Profile;