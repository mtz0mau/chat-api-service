import { check } from "express-validator";
import prisma from "../database/prisma.js";

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { firstname, lastname, email, password } = req.body;

  try {
    // comprobar que el email no esté en uso
    const userExists = await prisma.root.findUnique({
      where: {
        email,
      },
    });

    if (userExists) return res.status(400).json({ error: 'Email is already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.root.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ uuid: user.uuid }, JWT_SECRET_KEY, { expiresIn: '24h' });
    res.json({
      token,
      user: {
        uuid: user.uuid,
        firstname: user.firstname,
        lastname: user.lastname,
        picture_url: user.picture_url,
        email: user.email,
        valid_email: user.valid_email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to register the user" });
  }
};

export const validateRegister = [
  check('firstname').isString().isLength({ min: 3, max: 255 }),
  check('lastname').isString().isLength({ min: 3, max: 255 }),
  check('email').isEmail().isLength({ min: 3, max: 255 }),
  check('password').isString().isLength({ min: 6, max: 255 }),
];
