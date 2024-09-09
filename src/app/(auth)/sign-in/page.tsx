import styles from "./page.module.css";
import Link from "next/link";

export default function SignIn() {
  return (
  <div className={styles.body}>
    <div className={styles.signIn}>
      <h2 className={styles.title}>Sign In</h2>
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <input type="text" id="email" name="email" className={styles.formInput} />
          <label htmlFor="email" className={styles.formLabel}>Email</label>
        </div>
        <div className={styles.formGroup}>
          <input type="password" id="password" name="password" className={styles.formInput} />
          <label htmlFor="password" className={styles.formLabel}>Password</label>
        </div>
        <div className={styles.alternative}> <p>OR</p> <button>Google</button><button>GitHub</button> </div>
        <button type="submit" className={styles.button}>Sign In</button>
        <div className={styles.footer}>Don't have an account? <Link href="/sign-up" className={styles.link}>Sign Up</Link></div>
      </form>
    </div>
  </div>)
}