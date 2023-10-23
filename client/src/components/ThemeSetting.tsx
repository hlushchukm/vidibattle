export default function ThemeSetting() {
  return (
    <>
      {/* Theme Color Settings  */}
      <div
        className="offcanvas offcanvas-bottom"
        tabIndex={-1}
        id="offcanvasBottom"
      >
        <div className="offcanvas-body small">
          <ul className="theme-color-settings">
            <li>
              <input
                className="filled-in"
                id="primary_color_8"
                name="theme_color"
                type="radio"
                value="color-primary"
              />
              <label htmlFor="primary_color_8"></label>
              <span>Default</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_2"
                name="theme_color"
                type="radio"
                value="color-green"
              />
              <label htmlFor="primary_color_2"></label>
              <span>Green</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_3"
                name="theme_color"
                type="radio"
                value="color-blue"
              />
              <label htmlFor="primary_color_3"></label>
              <span>Blue</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_4"
                name="theme_color"
                type="radio"
                value="color-pink"
              />
              <label htmlFor="primary_color_4"></label>
              <span>Pink</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_5"
                name="theme_color"
                type="radio"
                value="color-yellow"
              />
              <label htmlFor="primary_color_5"></label>
              <span>Yellow</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_6"
                name="theme_color"
                type="radio"
                value="color-orange"
              />
              <label htmlFor="primary_color_6"></label>
              <span>Orange</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_7"
                name="theme_color"
                type="radio"
                value="color-purple"
              />
              <label htmlFor="primary_color_7"></label>
              <span>Purple</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_1"
                name="theme_color"
                type="radio"
                value="color-red"
              />
              <label htmlFor="primary_color_1"></label>
              <span>Red</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_9"
                name="theme_color"
                type="radio"
                value="color-lightblue"
              />
              <label htmlFor="primary_color_9"></label>
              <span>Lightblue</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_10"
                name="theme_color"
                type="radio"
                value="color-teal"
              />
              <label htmlFor="primary_color_10"></label>
              <span>Teal</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_11"
                name="theme_color"
                type="radio"
                value="color-lime"
              />
              <label htmlFor="primary_color_11"></label>
              <span>Lime</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_12"
                name="theme_color"
                type="radio"
                value="color-deeporange"
              />
              <label htmlFor="primary_color_12"></label>
              <span>Deeporange</span>
            </li>
          </ul>
        </div>
      </div>
      {/* Theme Color Settings End  */}
    </>
  );
}
