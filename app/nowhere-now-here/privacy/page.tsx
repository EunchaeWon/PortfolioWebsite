import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NOWHERE, NOW HERE Privacy Policy",
  description: "Privacy policy for the Android game NOWHERE, NOW HERE by Eunchae Won.",
};

export default function GamePrivacyPolicy() {
  return (
    <main className="game-privacy-page">
      <article className="game-privacy-document">
        <Link className="game-privacy-back" href="/">← Eunchae Won</Link>
        <p className="game-privacy-kicker">NOWHERE, NOW HERE / ANDROID GAME</p>
        <h1>Privacy Policy</h1>
        <p className="game-privacy-date">Effective September 29, 2026</p>

        <p>
          This policy explains how the Android game <em>NOWHERE, NOW HERE</em>,
          developed and published by Eunchae Won, handles information. It applies
          to the game distributed through Google Play.
        </p>

        <h2>Information used by the game</h2>
        <p>
          The game does not ask you to create an account or provide your name,
          email address, or contact details to play. Gameplay and settings run on
          your device. The developer does not operate a game server that receives
          your gameplay, and the game does not display advertising.
        </p>
        <p>
          The Android build uses Google Play services to verify and deliver the
          app and its game assets. These services may process technical information
          such as your device characteristics, app version, installation state,
          and network information to provide the correct files and maintain the
          installation. Google handles that information under its own privacy
          terms. The game does not use this information to build a player profile.
        </p>

        <h2>Sharing and purpose</h2>
        <p>
          The developer does not sell personal data or share it with advertisers.
          Google Play and its service providers process information needed for
          app distribution, licensing, security, and asset delivery. This policy
          does not cover information you separately provide to Google through your
          Google account or the Play Store.
        </p>

        <h2>Storage, security, and deletion</h2>
        <p>
          Any game settings or temporary data stored on your device remain there
          until you clear the app&apos;s data or uninstall it. The developer does
          not keep a separate server copy of your gameplay data. Network
          communication with Google Play services is protected by Google&apos;s
          security measures, including encryption in transit. Google determines
          the retention and deletion periods for information handled by its
          services.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If the game&apos;s data practices change, this page will be updated with
          a new effective date. The Google Play Data safety information will be
          updated where applicable.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy questions, contact Eunchae Won at{" "}
          <a href="mailto:artiwon821@gmail.com">artiwon821@gmail.com</a>.
        </p>
      </article>
    </main>
  );
}
