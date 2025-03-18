import { motion } from "framer-motion";

const Header = ({ title, description, variant = "default" }) => {
  return (
    <div className="mt-28 flex flex-col items-center justify-center text-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-3xl md:text-4xl 2xl:text-6xl font-bold leading-tight "
      >
        {title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-1 text-sm md:text-base 2xl:text-md text-muted-foreground"
      >
        {description}
      </motion.p>
    </div>
  );
};

export default Header;
