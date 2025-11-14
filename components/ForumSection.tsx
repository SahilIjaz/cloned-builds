import Link from 'next/link';
import Image from 'next/image';

export default function ForumSection() {
  return (
    <div className="max-w-[1440px] w-full flex justify-center items-center py-20">
      <div className="flex w-[90%] h-auto xl:justify-between items-center xl:mt-20 mt-6 justify-center flex-col xl:flex-row gap-12">
        <div className="flex flex-col w-full xl:text-left text-center xl:w-[50%] gap-8 justify-center max-w-[766px]">
          <div className="xl:hidden leading-[2.75rem] flex flex-col gap-4 text-3xl tsm:text-4xl sm:text-5xl font-bold">
            Ask Questions Or Share Builds on our Forum
          </div>
          <div className="xl:flex hidden flex-col gap-4 text-3xl tsm:text-4xl sm:text-5xl font-bold">
            <span>Ask Questions Or Share</span>
            <span>Builds on our Forum</span>
          </div>

          <Link
            href="/forum"
            className="w-full flex justify-center xl:justify-start"
          >
            <button className="w-[50%] bg-mono rounded-md flex justify-center items-center font-semibold py-2 text-lg gap-2 hover:opacity-90 hover:scale-95 transition-all">
              Go to Forum
            </button>
          </Link>
        </div>

        <div className="xl:flex hidden">
          <Image
            src="https://res.cloudinary.com/gamma1199/image/upload/v1712402205/forum_ysedaq.webp"
            alt="forum"
            width={500}
            height={500}
            className="rounded-md shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
