import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// Auth user & get token
// POST /api/users/login
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //   res.send({ email, password });

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Email ou mot de passe erronnée');
  }
});

// Register a new user
// POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //   res.send({ email, password });

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Cet utilisateur existe déjà');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Donnée invalide');
  }
});

// Get user profile
// GET /api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('Utilisateur introuvable');
  }
});

export { authUser, registerUser, getUserProfile };
