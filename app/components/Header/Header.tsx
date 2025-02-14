import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <h4>
              <Link href="/">Home</Link>
            </h4>
          </li>
        </ul>
      </nav>
    </header>
  );
}
