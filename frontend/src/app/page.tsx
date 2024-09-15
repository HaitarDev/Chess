import Image from "next/image";
import chessBoardImg from "@/app/public/chessBoard.jpg";
import Link from "next/link";

export default function Home() {
  return (
    <div className=" p-12 h-full max-w-screen-lg mx-auto ">
      <div className="flex items-center justify-center gap-8">
        <div>
          <Image
            alt="chessBoard"
            src={chessBoardImg}
            className="border-white border"
            width={800}
            height={800}
          />
        </div>
        <div className="flex items-start flex-col gap-6">
          <h1 className="font-bold text-4xl text-wrap">
            Play chess online on the #3 best chess platform
          </h1>
          <Link
            href={"/game"}
            className="px-8 py-3 text-lg font-semibold bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
          >
            Play now!
          </Link>
        </div>
      </div>
    </div>
  );
}
