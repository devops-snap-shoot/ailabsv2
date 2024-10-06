export const DashboardIcon = ({fill, width = "24", height = "18"}:{fill: string, width?: string, height?: string}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 9C14 10.019 13.692 10.964 13.168 11.754L10.293 8.879C10.105 8.691 10 8.437 10 8.172V4.101C12.282 4.564 14 6.581 14 9ZM8 8.586V4.101C5.45 4.619 3.604 7.077 4.073 9.868C4.398 11.802 5.893 13.411 7.802 13.86C9.272 14.205 10.662 13.893 11.754 13.169L8.585 10C8.21 9.625 8 9.116 8 8.586ZM19 4H17C16.447 4 16 4.448 16 5C16 5.552 16.447 6 17 6H19C19.553 6 20 5.552 20 5C20 4.448 19.553 4 19 4ZM19 8H17C16.447 8 16 8.448 16 9C16 9.552 16.447 10 17 10H19C19.553 10 20 9.552 20 9C20 8.448 19.553 8 19 8ZM19 12H17C16.447 12 16 12.448 16 13C16 13.552 16.447 14 17 14H19C19.553 14 20 13.552 20 13C20 12.448 19.553 12 19 12ZM24 5V13C24 15.757 21.757 18 19 18H5C2.243 18 0 15.757 0 13V5C0 2.243 2.243 0 5 0H19C21.757 0 24 2.243 24 5ZM22 5C22 3.346 20.654 2 19 2H5C3.346 2 2 3.346 2 5V13C2 14.654 3.346 16 5 16H19C20.654 16 22 14.654 22 13V5Z" fill={fill} />
        </svg>
    )
}