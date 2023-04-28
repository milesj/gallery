import * as React from 'react';
import Svg, { Defs, G, Mask, Path, SvgProps, Use } from 'react-native-svg';

export function PoapIcon(props: SvgProps) {
  return (
    <Svg viewBox="0 0 100 131" {...props}>
      <Defs>
        <Path id="a" d="M0 0.163694772L99.8094923 0.163694772 99.8094923 100.10196 0 100.10196z" />
      </Defs>
      <G stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
        <Path
          d="M77.995 90.554c1.675 3.955 3.353 7.909 5.025 11.865 1.9 4.499 3.773 9.009 5.701 13.496.665 1.546.786 3.03-.395 4.32-1.149 1.256-2.61 1.31-4.161.761-3.703-1.307-7.427-2.554-11.12-3.89-.906-.327-1.278-.09-1.659.742a743.036 743.036 0 01-5.208 11.072c-.703 1.469-1.936 2.018-3.53 1.9-1.414-.104-2.287-.899-2.808-2.138-2.745-6.534-5.479-13.072-8.22-19.607-.126-.302-.285-.59-.51-1.051-.943 2.223-1.833 4.298-2.704 6.38-1.983 4.743-3.95 9.491-5.94 14.23-.595 1.418-1.629 2.183-3.233 2.198-1.613.016-2.592-.766-3.249-2.162-1.735-3.692-3.513-7.364-5.24-11.059-.32-.683-.646-.787-1.361-.533-3.908 1.387-7.836 2.72-11.764 4.05-1.372.464-2.686.221-3.645-.848-.96-1.07-1.239-2.36-.636-3.79 3.208-7.614 6.388-15.239 9.584-22.857.156-.37.37-.717.556-1.075.49.205.95.454 1.264.906-1.58 3.833-3.15 7.67-4.745 11.498-1.638 3.932-3.305 7.852-4.95 11.782-.358.857-.48 1.734.249 2.467.671.676 1.447.473 2.248.193 4.087-1.433 8.193-2.811 12.269-4.274 1.041-.373 1.549-.178 2.019.853 1.813 3.98 3.72 7.916 5.587 11.87.369.782.891 1.39 1.816 1.377.87-.012 1.408-.572 1.727-1.334 2.921-6.977 5.81-13.969 8.779-20.925.462-1.085.385-1.92-.262-2.82-.3.18-.349.44-.446.67-2.89 6.872-5.779 13.745-8.673 20.614-.193.457-.252 1.104-.902 1.117-.69.015-.813-.656-1.052-1.13-1.984-3.944-3.977-7.883-5.916-11.848-.347-.71-.676-.875-1.425-.614-2.147.751-4.319 1.43-6.484 2.127-2.2.71-4.405 1.403-6.605 2.114-.367.119-.721.224-1.017-.107-.254-.285-.178-.611-.045-.932.113-.271.206-.55.32-.822 2.967-7.078 5.936-14.155 8.904-21.233 2.48.653 5.02.587 7.529.431 3.316-.206 6.147.85 8.843 2.655 2.186 1.463 4.436 2.875 7.212 2.933 3.824 9.145 7.653 18.288 11.463 27.439.36.865.78 1.635 1.817 1.663 1.036.028 1.53-.715 1.925-1.557 1.765-3.758 3.518-7.522 5.323-11.26.843-1.746.428-1.857 2.682-1.08 3.954 1.363 7.912 2.719 11.858 4.107.868.305 1.645.368 2.314-.361.678-.739.485-1.514.134-2.346-3.477-8.256-6.934-16.52-10.397-24.782.354-.49.641-1.036 1.154-1.395"
          fill="#FCCDD3"
          transform="translate(-24 -24) translate(24 24)"
        />
        <G transform="translate(-24 -24) translate(24 24) translate(0 .057)">
          <Mask id="b" fill="#fff">
            <Use xlinkHref="#a" />
          </Mask>
          <Path
            d="M33.473 7.705c-1.786 0-3.002-.05-4.212.01-2.204.11-4.04.931-5.353 2.81-1.016 1.454-1.856 3.003-2.653 4.575-1.431 2.823-3.536 4.932-6.363 6.353-1.246.627-2.446 1.347-3.66 2.035-2.54 1.44-3.733 3.648-3.708 6.548.016 1.877 0 3.755.03 5.632.032 2.08-.5 4-1.552 5.78-.842 1.423-1.682 2.85-2.555 4.254-1.804 2.904-1.895 5.798-.026 8.71.436.68.789 1.418 1.26 2.072 2.217 3.08 3.207 6.484 2.882 10.283-.1 1.17-.044 2.355-.034 3.532.021 2.511.888 4.603 3.072 6.002.834.534 1.661 1.109 2.56 1.51 4.03 1.796 7.05 4.587 8.847 8.663.37.837.877 1.614 1.336 2.41 1.438 2.494 3.639 3.644 6.478 3.643 1.95 0 3.9-.005 5.849-.024 2.08-.02 3.984.575 5.76 1.62 1.424.84 2.848 1.683 4.252 2.557 2.803 1.746 5.596 1.768 8.406.023 1.061-.66 2.156-1.266 3.202-1.95 2.408-1.572 4.997-2.424 7.908-2.263 1.578.087 3.163.033 4.745.038 2.883.008 5.114-1.15 6.557-3.698.688-1.216 1.41-2.415 2.036-3.663 1.418-2.827 3.497-4.96 6.337-6.373 1.281-.638 2.523-1.362 3.753-2.096 1.998-1.19 3.338-2.834 3.566-5.254.212-2.243.065-4.486.059-6.728-.007-2.274.56-4.356 1.735-6.29.859-1.414 1.698-2.84 2.551-4.257 1.581-2.625 1.66-5.273.111-7.936-.684-1.175-1.373-2.35-2.11-3.492-1.582-2.445-2.46-5.064-2.288-8.02.093-1.614.056-3.238.033-4.857-.034-2.46-.886-4.509-3.016-5.924-1.443-.959-2.96-1.783-4.496-2.568-2.71-1.386-4.744-3.423-6.137-6.13a82.52 82.52 0 00-2.202-3.95c-1.186-2.022-2.895-3.31-5.28-3.528-.914-.084-1.837-.053-2.755-.07-1.984-.035-3.978.165-5.951-.104-2.438-.333-4.529-1.565-6.445-2.98-4.093-3.023-8.047-3.066-12.14-.015-3.232 2.41-6.842 3.72-10.389 3.11m-8.731 85.701c-.314-.451-.773-.7-1.264-.905-2.111-2.484-3.397-5.48-5.097-8.22-1.067-1.719-2.706-2.763-4.433-3.705-1.677-.915-3.404-1.745-4.938-2.904-2.228-1.685-3.376-3.934-3.462-6.714-.04-1.323-.105-2.66.02-3.973.334-3.504-.63-6.598-2.626-9.452-.755-1.08-1.399-2.251-1.98-3.436-1.317-2.68-1.257-5.385.03-8.076.732-1.531 1.663-2.945 2.568-4.372 1.375-2.171 2.164-4.474 2.014-7.086-.09-1.578-.021-3.164-.04-4.747-.045-3.566 1.542-6.207 4.56-8.017 1.165-.7 2.343-1.387 3.562-1.983 2.678-1.31 4.647-3.275 5.97-5.956.908-1.842 1.851-3.675 3.214-5.253 1.673-1.937 3.812-2.816 6.316-2.888 1.286-.037 2.585-.118 3.859.014 3.593.372 6.731-.697 9.638-2.73.96-.672 2.009-1.223 3.05-1.766 2.813-1.469 5.633-1.395 8.46.007 1.454.722 2.815 1.596 4.173 2.471 2.2 1.418 4.56 2.146 7.192 2.031 1.58-.069 3.163-.023 4.744-.037 3.57-.032 6.18 1.601 7.966 4.63.727 1.235 1.454 2.475 2.09 3.758 1.239 2.502 3.1 4.336 5.59 5.58 1.544.773 3.065 1.594 4.491 2.576 2.552 1.757 3.836 4.191 3.869 7.284.012 1.215.092 2.439-.025 3.643-.345 3.542.625 6.678 2.658 9.552.635.897 1.16 1.877 1.683 2.846 1.744 3.227 1.57 6.417-.259 9.55-.908 1.556-1.832 3.102-2.753 4.65-.926 1.557-1.35 3.24-1.328 5.049.02 1.84 0 3.681.03 5.521.061 3.57-1.518 6.216-4.519 8.042a67.257 67.257 0 01-3.946 2.204c-2.175 1.132-3.962 2.643-5.111 4.855-.881 1.695-1.806 3.367-2.712 5.048-.514.359-.801.904-1.156 1.395-.466.263-.822.65-1.163 1.051-1.97 1.322-4.167 1.668-6.489 1.588-1.65-.057-3.303-.013-4.955-.017a8.075 8.075 0 00-3.308.671c-3.268 1.437-6.011 3.888-9.49 4.917-.568-.162-1.142-.036-1.713-.034-2.776-.057-5.026-1.47-7.212-2.933-2.696-1.804-5.527-2.86-8.843-2.654-2.509.156-5.05.222-7.53-.43-.42-.314-.865-.571-1.395-.645"
            fill="#6534FF"
            mask="url(#b)"
          />
        </G>
        <Path
          d="M64.014 60.57c.894.026 1.495-.714 1.234-1.63-1.59-5.572-3.204-11.138-4.812-16.705-.248-.858-.902-1.031-1.652-.853-.612.146-.774.724-.933 1.262-1.032 3.48-2.064 6.962-3.098 10.442-.565 1.898-1.155 3.79-1.687 5.696-.22.786-.053 1.517.857 1.744.793.198 1.338-.121 1.552-.976.204-.817.512-1.609.717-2.426.142-.563.435-.765 1.01-.75 1.284.033 2.571.033 3.856 0 .605-.014.939.146 1.067.8.155.79.428 1.556.672 2.325.188.591.486 1.084 1.217 1.07m-28.886-9.568c-.087.914.177 1.777.604 2.614.818 1.603 1.634 3.21 2.41 4.833.626 1.308 1.571 2.084 3.064 2.135 1.572.054 2.534-.77 3.18-2.105.845-1.754 1.726-3.491 2.551-5.254.71-1.518.705-3.06-.033-4.576-.916-1.883-1.821-3.773-2.783-5.633-1.152-2.228-4.354-2.388-5.605-.205-1.166 2.037-2.116 4.197-3.13 6.318-.27.567-.317 1.205-.258 1.873m35.75-.377c0 2.796.01 5.592-.007 8.388-.005.91.317 1.536 1.292 1.547 1.113.013 1.282-.832 1.3-1.679.034-1.581.038-3.165-.002-4.745-.016-.676.21-.895.883-.88 1.727.038 3.457.04 5.184.003 2.056-.044 3.617-1.588 3.68-3.648.047-1.544.05-3.092 0-4.636-.07-2.101-1.692-3.632-3.79-3.638-2.5-.007-5 .03-7.5-.02-.803-.016-1.078.177-1.061 1.03.055 2.758.02 5.518.02 8.278m-53.642.034c0 2.722-.001 5.445.002 8.168 0 .292-.04.61.058.873.226.612.689.93 1.37.867.85-.078 1.113-.706 1.136-1.39.056-1.617.067-3.238.013-4.855-.026-.802.175-1.107 1.033-1.073 1.688.065 3.382.05 5.073.008 1.999-.049 3.565-1.57 3.642-3.57.06-1.58.059-3.166.001-4.746-.077-2.096-1.706-3.6-3.82-3.604-2.5-.006-5.002.037-7.5-.022-.858-.02-1.04.267-1.026 1.066.047 2.758.018 5.518.018 8.278M33.473 7.762c3.547.61 7.157-.7 10.389-3.11 4.093-3.05 8.047-3.008 12.14.015 1.916 1.415 4.006 2.647 6.445 2.98 1.973.269 3.967.07 5.95.105.92.016 1.842-.014 2.755.07 2.386.217 4.095 1.505 5.281 3.528.763 1.3 1.512 2.61 2.202 3.949 1.393 2.707 3.427 4.744 6.137 6.13 1.537.785 3.053 1.61 4.496 2.568 2.13 1.415 2.982 3.464 3.016 5.924.023 1.62.06 3.244-.033 4.858-.171 2.955.706 5.574 2.287 8.02.738 1.141 1.427 2.316 2.111 3.492 1.55 2.662 1.47 5.31-.11 7.935-.854 1.417-1.693 2.843-2.552 4.257-1.174 1.934-1.742 4.017-1.735 6.29.006 2.242.153 4.486-.059 6.729-.228 2.42-1.568 4.063-3.566 5.254-1.23.733-2.471 1.458-3.753 2.095-2.84 1.414-4.919 3.546-6.337 6.374-.626 1.247-1.348 2.446-2.036 3.662-1.443 2.549-3.674 3.707-6.557 3.698-1.582-.005-3.167.05-4.745-.038-2.911-.16-5.5.691-7.908 2.264-1.046.683-2.14 1.29-3.202 1.95-2.81 1.744-5.603 1.722-8.406-.024a200.416 200.416 0 00-4.253-2.557c-1.775-1.045-3.68-1.64-5.76-1.62-1.948.02-3.898.024-5.848.024-2.84.001-5.04-1.149-6.478-3.643-.459-.796-.967-1.573-1.336-2.41-1.797-4.076-4.817-6.867-8.847-8.663-.9-.4-1.726-.976-2.56-1.51-2.184-1.4-3.051-3.49-3.072-6.002-.01-1.177-.067-2.362.034-3.532.325-3.799-.665-7.202-2.882-10.283-.471-.654-.823-1.392-1.26-2.072-1.869-2.912-1.778-5.806.026-8.71.873-1.405 1.713-2.83 2.555-4.254 1.053-1.78 1.584-3.7 1.552-5.78-.03-1.877-.014-3.754-.03-5.632-.025-2.9 1.168-5.107 3.708-6.548 1.214-.688 2.414-1.408 3.66-2.035 2.827-1.42 4.932-3.53 6.363-6.353.797-1.572 1.637-3.121 2.653-4.575 1.313-1.879 3.15-2.7 5.352-2.81 1.211-.06 2.427-.01 4.213-.01"
          fill="#FEFEFE"
          transform="translate(-24 -24) translate(24 24)"
        />
        <Path
          d="M75.677 93l8.15 19.505c.468 1.117.948 2.23 1.396 3.355.157.394.431.828.06 1.24-.38.42-.814.16-1.226.027-4.26-1.37-8.527-2.717-12.771-4.133-.845-.282-1.191-.101-1.574.683-1.93 3.966-3.928 7.9-5.906 11.843-.21.418-.346.908-.974.904-.654-.004-.737-.544-.91-.956-3.428-8.154-6.843-16.313-10.254-24.473-.111-.265-.157-.557-.233-.836 3.479-1.029 6.223-3.48 9.49-4.916a8.081 8.081 0 013.308-.672c1.652.005 3.305-.04 4.955.017 2.322.08 4.52-.266 6.489-1.588"
          fill="#FCCDD3"
          transform="translate(-24 -24) translate(24 24)"
        />
        <Path
          d="M19.724 47.262c0 .918.017 1.836-.007 2.754-.013.53.113.814.729.803 1.724-.03 3.449-.006 5.173-.013.941-.005 1.44-.54 1.472-1.433.048-1.357.055-2.718.002-4.075-.035-.926-.519-1.49-1.54-1.478-1.65.02-3.303.027-4.953-.005-.682-.014-.912.26-.884.914.035.843.008 1.689.008 2.533m-2.489 3.396c0-2.76.029-5.52-.018-8.278-.013-.8.168-1.087 1.026-1.066 2.498.059 5 .016 7.5.022 2.114.005 3.743 1.508 3.82 3.605a63.22 63.22 0 01-.001 4.745c-.077 2-1.643 3.521-3.643 3.57-1.69.042-3.384.057-5.072-.008-.858-.034-1.06.27-1.033 1.073a71.635 71.635 0 01-.013 4.855c-.023.684-.285 1.312-1.136 1.39-.681.063-1.144-.255-1.37-.867-.097-.263-.058-.58-.058-.873-.003-2.723-.002-5.446-.002-8.168M73.367 47.307c0 .918.024 1.837-.009 2.754-.021.582.212.765.775.757 1.687-.025 3.376-.012 5.063-.009.994.002 1.512-.531 1.541-1.48a53.697 53.697 0 00-.006-4.075c-.042-.937-.572-1.453-1.58-1.436-1.614.027-3.23.033-4.843-.005-.722-.017-.99.245-.952.96.043.843.01 1.69.01 2.534m-2.488 3.317c0-2.76.034-5.52-.021-8.278-.017-.852.258-1.046 1.062-1.03 2.499.05 5 .013 7.5.02 2.097.006 3.719 1.537 3.788 3.638.051 1.544.048 3.092.001 4.636-.063 2.06-1.624 3.604-3.68 3.648a118.21 118.21 0 01-5.184-.004c-.672-.014-.9.205-.882.88.039 1.582.035 3.165.001 4.746-.018.847-.187 1.692-1.3 1.68-.975-.012-1.297-.637-1.292-1.548.017-2.796.007-5.592.007-8.388M44.894 50.972c-.071-.357-.074-.747-.226-1.066a182.077 182.077 0 00-2.734-5.53c-.414-.795-1.066-.787-1.484.023-.907 1.763-1.758 3.556-2.602 5.35-.436.927-.32 1.866.123 2.764.796 1.614 1.608 3.221 2.41 4.833.184.369.37.762.856.74.417-.018.604-.36.774-.7.839-1.675 1.686-3.346 2.525-5.022.216-.432.343-.892.358-1.392m-9.766.03c-.06-.669-.013-1.307.258-1.874 1.014-2.12 1.965-4.282 3.13-6.317 1.25-2.185 4.453-2.024 5.605.204.962 1.86 1.867 3.75 2.783 5.633.738 1.515.743 3.058.033 4.576-.825 1.763-1.706 3.5-2.552 5.254-.645 1.336-1.607 2.159-3.179 2.105-1.493-.051-2.438-.827-3.064-2.134a207.824 207.824 0 00-2.41-4.834c-.427-.837-.691-1.7-.604-2.614M59.333 47.58l-.284.006c-.338 1.146-.704 2.285-1.006 3.44-.246.945-1.171 2.21-.53 2.75.627.528 2.025.13 3.084.152.46.01.549-.143.414-.59-.579-1.914-1.122-3.838-1.678-5.759m4.681 12.99c-.73.014-1.03-.479-1.217-1.07-.244-.77-.517-1.536-.672-2.324-.128-.655-.462-.816-1.067-.8a75.81 75.81 0 01-3.856 0c-.575-.016-.868.186-1.01.75-.205.816-.513 1.608-.717 2.425-.214.855-.76 1.174-1.552.976-.91-.227-1.077-.958-.857-1.744.532-1.907 1.122-3.798 1.687-5.696 1.034-3.48 2.066-6.961 3.098-10.442.159-.538.32-1.116.933-1.262.75-.178 1.404-.005 1.652.853 1.608 5.567 3.222 11.133 4.812 16.705.262.916-.34 1.656-1.234 1.629"
          fill="#6534FF"
          transform="translate(-24 -24) translate(24 24)"
        />
        <Path
          d="M19.724 47.262c0-.844.027-1.69-.008-2.533-.027-.654.202-.928.884-.914 1.65.032 3.302.024 4.953.005 1.021-.012 1.504.552 1.54 1.478a54.999 54.999 0 01-.002 4.075c-.032.893-.53 1.428-1.472 1.433-1.724.007-3.45-.017-5.173.013-.616.011-.742-.273-.729-.803.024-.918.007-1.836.007-2.754M73.366 47.307c0-.845.033-1.69-.01-2.533-.037-.716.23-.978.952-.96 1.613.037 3.229.031 4.843.004 1.008-.017 1.538.5 1.58 1.436.062 1.355.048 2.717.006 4.074-.029.95-.547 1.483-1.54 1.481-1.688-.003-3.377-.016-5.064.009-.563.008-.796-.175-.775-.757.033-.917.009-1.836.008-2.754M44.894 50.972c-.015.5-.142.96-.358 1.392-.839 1.676-1.686 3.347-2.525 5.022-.17.34-.357.682-.774.7-.486.022-.672-.371-.856-.74-.802-1.612-1.614-3.219-2.41-4.833-.443-.898-.559-1.837-.123-2.764.844-1.794 1.695-3.587 2.602-5.35.418-.81 1.07-.818 1.484-.024.95 1.824 1.846 3.676 2.734 5.531.152.319.155.709.226 1.066M59.333 47.58c.556 1.92 1.1 3.844 1.678 5.758.135.447.047.6-.414.59-1.059-.023-2.457.376-3.083-.151-.642-.54.283-1.806.53-2.75.301-1.156.667-2.295 1.005-3.441l.284-.007"
          fill="#FEFEFE"
          transform="translate(-24 -24) translate(24 24)"
        />
      </G>
    </Svg>
  );
}