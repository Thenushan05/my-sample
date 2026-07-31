import type { HTMLAttributes } from "react"

const PHONE_WIDTH = 433
const PHONE_HEIGHT = 882
const SCREEN_X = 21.25
const SCREEN_Y = 19.25
const SCREEN_WIDTH = 389.5
const SCREEN_HEIGHT = 843.5
const SCREEN_RADIUS = 55.75

// Calculated percentages
const LEFT_PCT = (SCREEN_X / PHONE_WIDTH) * 100
const TOP_PCT = (SCREEN_Y / PHONE_HEIGHT) * 100
const WIDTH_PCT = (SCREEN_WIDTH / PHONE_WIDTH) * 100
const HEIGHT_PCT = (SCREEN_HEIGHT / PHONE_HEIGHT) * 100
const RADIUS_H = (SCREEN_RADIUS / SCREEN_WIDTH) * 100
const RADIUS_V = (SCREEN_RADIUS / SCREEN_HEIGHT) * 100

export interface IphoneProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  videoSrc?: string
}

export function Iphone({
  src,
  videoSrc,
  className,
  style,
  ...props
}: IphoneProps) {
  const hasVideo = !!videoSrc
  const hasMedia = hasVideo || !!src

  return (
    <div
      className={`relative inline-block w-full align-middle leading-none ${className ?? ""}`}
      style={{
        aspectRatio: `${PHONE_WIDTH}/${PHONE_HEIGHT}`,
        ...style,
      }}
      {...props}
    >
      {hasVideo && (
        <div
          className="pointer-events-none absolute z-0 overflow-hidden"
          style={{
            left: `${LEFT_PCT}%`,
            top: `${TOP_PCT}%`,
            width: `${WIDTH_PCT}%`,
            height: `${HEIGHT_PCT}%`,
            borderRadius: `${RADIUS_H}% / ${RADIUS_V}%`,
          }}
        >
          <video
            className="block size-full object-cover"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        </div>
      )}

      {!hasVideo && src && (
        <div
          className="pointer-events-none absolute z-0 overflow-hidden"
          style={{
            left: `${LEFT_PCT}%`,
            top: `${TOP_PCT}%`,
            width: `${WIDTH_PCT}%`,
            height: `${HEIGHT_PCT}%`,
            borderRadius: `${RADIUS_H}% / ${RADIUS_V}%`,
          }}
        >
          <img
            src={src}
            alt=""
            className="block size-full object-cover object-top"
          />
        </div>
      )}

      <svg
        viewBox={`0 0 ${PHONE_WIDTH} ${PHONE_HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 size-full"
        style={{ transform: "translateZ(0)" }}
      >
        <g mask={hasMedia ? "url(#screenPunch)" : undefined}>
          <path
            d="M2 73C2 32.6832 34.6832 0 75 0H357C397.317 0 430 32.6832 430 73V809C430 849.317 397.317 882 357 882H75C34.6832 882 2 849.317 2 809V73Z"
            className="fill-[#E5E5E5] dark:fill-[#404040] [.spiderman_&]:fill-[#2a0a0a] transition-colors duration-500"
          />
          <path
            d="M0 171C0 170.448 0.447715 170 1 170H3V204H1C0.447715 204 0 203.552 0 203V171Z"
            className="fill-[#E5E5E5] dark:fill-[#404040] [.spiderman_&]:fill-[#2a0a0a] transition-colors duration-500"
          />
          <path
            d="M4.90807 101.405C3.39956 101.405 2.17664 100.182 2.17664 98.6738V76.5404C2.17664 75.0319 3.39956 73.809 4.90807 73.809C6.41658 73.809 7.63949 75.0319 7.63949 76.5404V98.6738C7.63949 100.182 6.41658 101.405 4.90807 101.405Z"
            className="fill-[#E5E5E5] dark:fill-[#404040] [.spiderman_&]:opacity-0 transition-all duration-500"
          />
          <path
            d="M4.90807 141.042C3.39956 141.042 2.17664 139.819 2.17664 138.311V103.498C2.17664 101.99 3.39956 100.767 4.90807 100.767C6.41658 100.767 7.63949 101.99 7.63949 103.498V138.311C7.63949 139.819 6.41658 141.042 4.90807 141.042Z"
            className="fill-[#E5E5E5] dark:fill-[#404040] [.spiderman_&]:opacity-0 transition-all duration-500"
          />
          <path
            d="M425 212.721C426.509 212.721 427.731 211.498 427.731 209.99V152.083C427.731 150.575 426.509 149.352 425 149.352C423.491 149.352 422.269 150.575 422.269 152.083V209.99C422.269 211.498 423.491 212.721 425 212.721Z"
            className="fill-[#E5E5E5] dark:fill-[#404040] [.spiderman_&]:opacity-0 transition-all duration-500"
          />
          <path
            d="M428.163 176.602C428.163 177.356 427.552 177.967 426.798 177.967H423.774C423.02 177.967 422.409 177.356 422.409 176.602V155.65C422.409 154.896 423.02 154.285 423.774 154.285H426.798C427.552 154.285 428.163 154.896 428.163 155.65V176.602Z"
            className="fill-white dark:fill-[#262626] [.spiderman_&]:opacity-0 transition-all duration-500"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M259.5 44C257.015 44 255 46.0147 255 48.5C255 50.9853 257.015 53 259.5 53C261.985 53 264 50.9853 264 48.5C264 46.0147 261.985 44 259.5 44ZM254 48.5C254 45.4624 256.462 43 259.5 43C262.538 43 265 45.4624 265 48.5C265 51.5376 262.538 54 259.5 54C256.462 54 254 51.5376 254 48.5Z"
            className="fill-[#E5E5E5] dark:fill-[#404040] [.spiderman_&]:opacity-0 transition-all duration-500"
          />
          <path
            d="M6 74C6 35.3401 37.3401 4 76 4H356C394.66 4 426 35.3401 426 74V808C426 846.66 394.66 878 356 878H76C37.3401 878 6 846.66 6 808V74Z"
            className="fill-white dark:fill-[#262626] [.spiderman_&]:fill-[#110505] transition-colors duration-500"
          />
        </g>

        <path
          opacity="0.5"
          d="M174 5H258V5.5C258 6.60457 257.105 7.5 256 7.5H176C174.895 7.5 174 6.60457 174 5.5V5Z"
          className="fill-[#E5E5E5] dark:fill-[#404040] [.spiderman_&]:fill-[#2a0a0a] transition-colors duration-500"
        />

        <path
          d={`M${SCREEN_X} 75C${SCREEN_X} 44.2101 46.2101 ${SCREEN_Y} 77 ${SCREEN_Y}H355C385.79 ${SCREEN_Y} 410.75 44.2101 410.75 75V807C410.75 837.79 385.79 862.75 355 862.75H77C46.2101 862.75 ${SCREEN_X} 837.79 ${SCREEN_X} 807V75Z`}
          className="fill-[#E5E5E5] stroke-[#E5E5E5] stroke-[0.5] dark:fill-[#404040] dark:stroke-[#404040] [.spiderman_&]:fill-[#1a0505] [.spiderman_&]:stroke-[#2a0a0a] transition-colors duration-500"
          mask={hasMedia ? "url(#screenPunch)" : undefined}
        />

        <path
          d="M154 48.5C154 38.2827 162.283 30 172.5 30H259.5C269.717 30 278 38.2827 278 48.5C278 58.7173 269.717 67 259.5 67H172.5C162.283 67 154 58.7173 154 48.5Z"
          className="fill-[#F5F5F5] dark:fill-[#262626] [.spiderman_&]:fill-[#0a0202] transition-colors duration-500"
        />
        <path
          d="M249 48.5C249 42.701 253.701 38 259.5 38C265.299 38 270 42.701 270 48.5C270 54.299 265.299 59 259.5 59C253.701 59 249 54.299 249 48.5Z"
          className="fill-[#F5F5F5] dark:fill-[#262626] [.spiderman_&]:fill-[#0a0202] transition-colors duration-500"
        />
        <path
          d="M254 48.5C254 45.4624 256.462 43 259.5 43C262.538 43 265 45.4624 265 48.5C265 51.5376 262.538 54 259.5 54C256.462 54 254 51.5376 254 48.5Z"
          className="fill-[#E5E5E5] dark:fill-[#404040] [.spiderman_&]:fill-[#2a0a0a] transition-colors duration-500"
        />

        {/* Spider-Bot HUD Overlay -> PS4 UI Device Frame */}
        <g className="opacity-0 [.spiderman_&]:opacity-100 transition-opacity duration-500 pointer-events-none">
          <path d="M 15 65 L 15 15 L 65 15" fill="none" stroke="white" strokeWidth="4" />
          <path d="M 415 65 L 415 15 L 365 15" fill="none" stroke="#ef4444" strokeWidth="4" />
          <path d="M 15 815 L 15 865 L 65 865" fill="none" stroke="#ef4444" strokeWidth="4" />
          <path d="M 415 815 L 415 865 L 365 865" fill="none" stroke="white" strokeWidth="4" />
          
          <rect
            x="15"
            y="15"
            width="400"
            height="850"
            className="fill-transparent stroke-white/20 stroke-[2]"
          />
        </g>

        <defs>
          <mask id="screenPunch" maskUnits="userSpaceOnUse">
            <rect
              x="0"
              y="0"
              width={PHONE_WIDTH}
              height={PHONE_HEIGHT}
              fill="white"
            />
            <rect
              x={SCREEN_X}
              y={SCREEN_Y}
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
              rx={SCREEN_RADIUS}
              ry={SCREEN_RADIUS}
              fill="black"
            />
          </mask>
          <clipPath id="roundedCorners">
            <rect
              x={SCREEN_X}
              y={SCREEN_Y}
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
              rx={SCREEN_RADIUS}
              ry={SCREEN_RADIUS}
            />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}
export default Iphone
