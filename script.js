const app = new Vue({
  el: "#app",
  data() {
    return {
      size: null,
      width: 26,
      height: 13,
      components: [
        {
          w: null,
          h: null,
          left: null,
          top: null,
          x: 0,
          y: 0,
          width: 4,
          height: 4,
        },
        {
          w: null,
          h: null,
          left: null,
          top: null,
          x: 4,
          y: 0,
          width: 4,
          height: 4,
        },
        {
          w: null,
          h: null,
          left: null,
          top: null,
          x: 8,
          y: 0,
          width: 4,
          height: 4,
        },
        {
          w: null,
          h: null,
          left: null,
          top: null,
          x: 0,
          y: 4,
          width: 12,
          height: 4,
        },
      ],
    };
  },
  methods: {
    moveElement(event, index) {
      const x = Math.floor(event.offsetX / this.size);
      const y = Math.floor(event.offsetY / this.size);

      if (x === 1 || x === -1) {
        this.moveX(x, index);
      }

      if (y === 1 || y === -1) {
        this.moveY(y, index);
      }
    },
    moveX(x, index) {
      const xRes = this.components[index].x + x;

      if (xRes < 0 || xRes + this.components[index].width > this.width) return;

      const arr = this.sortByAxis(
        this.checkCross(xRes, this.components[index].y, index),
        x,
        "y"
      );

      arr.forEach((cur) => {
        if (x >= 0) {
          if (
            this.components[cur].width + this.components[cur].x + x >
            this.width
          ) {
            if (this.checkCrossY(cur, index))
              return this.moveConditionY(cur, index);
          }
          return this.moveX(Math.abs(x), cur);
        }
        if (x < 0) {
          if (this.components[cur].x + x < 0) {
            if (this.checkCrossY(cur, index))
              return this.moveConditionY(cur, index);
          }
          return this.moveX(-Math.abs(x), cur);
        }
      });
      this.components[index].x += x;
      this.components[index].left += x * this.size;
    },
    moveY(y, index) {
      const yRes = this.components[index].y + y;

      if (yRes < 0 || yRes + this.components[index].height > this.height)
        return;

      const arr = this.sortByAxis(
        this.checkCross(this.components[index].x, yRes, index),
        y,
        "x"
      );

      arr.forEach((cur) => {
        if (y >= 0) {
          if (
            this.components[cur].y + this.components[cur].height + y >
            this.height
          ) {
            if (this.checkCrossX(cur, index))
              return this.moveConditionX(cur, index);
          }
          return this.moveY(Math.abs(y), cur);
        }
        if (y < 0) {
          if (this.components[cur].y + y < 0) {
            if (this.checkCrossX(cur, index))
              return this.moveConditionX(cur, index);
          }
          return this.moveY(-Math.abs(y), cur);
        }
      });
      this.components[index].y += y;
      this.components[index].top += y * this.size;
    },
    moveConditionY(cur, index) {
      const odd = this.getOdd(cur, index, "y", "height");

      if (odd + this.components[cur].y < 0) {
        return this.moveY(
          this.components[index].y -
            this.components[cur].y +
            this.components[index].height,
          cur
        );
      }

      if (
        odd + this.components[cur].y + this.components[cur].height >
        this.height
      ) {
        if (this.components[index].height > this.components[cur].height) {
          return this.moveX(
            -Math.abs(
              this.components[cur].y -
                this.components[index].y +
                this.components[cur].height
            ),
            cur
          );
        }
        return this.moveY(
          -Math.abs(
            Math.abs(this.components[index].y - this.components[cur].y) +
              this.components[cur].height
          ),
          cur
        );
      }

      return this.moveY(odd, cur);
    },
    moveConditionX(cur, index) {
      const odd = this.getOdd(cur, index, "x", "width");

      if (odd + this.components[cur].x < 0) {
        return this.moveX(
          this.components[index].x -
            this.components[cur].x +
            this.components[index].width,
          cur
        );
      }

      if (
        odd + this.components[cur].x + this.components[cur].width >
        this.width
      ) {
        if (this.components[index].width > this.components[cur].width) {
          return this.moveX(
            -Math.abs(
              this.components[cur].x -
                this.components[index].x +
                this.components[cur].width
            ),
            cur
          );
        }
        return this.moveX(
          -Math.abs(
            Math.abs(this.components[index].x - this.components[cur].x) +
              this.components[cur].width
          ),
          cur
        );
      }

      return this.moveX(odd, cur);
    },
    getOdd(cur, index, axis, par) {
      if (this.components[cur][axis] < this.components[index][axis]) {
        return -(
          this.components[cur][par] -
          (this.components[index][axis] - this.components[cur][axis])
        );
      }
      return (
        this.components[index][par] -
        (this.components[cur][axis] - this.components[index][axis])
      );
    },
    checkCross(x, y, index) {
      const arr = [];
      this.components.forEach((cur, ind) => {
        if (index === ind) return;
        if (
          x + this.components[index].width > cur.x &&
          x < cur.x + cur.width &&
          y < cur.height + cur.y &&
          y + this.components[index].height > cur.y
        ) {
          arr.push(ind);
        }
      });
      return arr;
    },
    checkCrossX(cur, index) {
      if (
        this.components[index].x + this.components[index].width >
          this.components[cur].x &&
        this.components[index].x <
          this.components[cur].x + this.components[cur].width
      ) {
        return true;
      }
      return false;
    },
    checkCrossY(cur, index) {
      if (
        this.components[index].y + this.components[index].height >
          this.components[cur].y &&
        this.components[index].y <
          this.components[cur].y + this.components[cur].height
      ) {
        return true;
      }
      return false;
    },
    sortByAxis(arr, int, axis) {
      if (int >= 0) {
        return arr.sort((a, b) => {
          return this.components[b][axis] - this.components[a][axis];
        });
      }
      return arr.sort((a, b) => {
        return this.components[a][axis] - this.components[b][axis];
      });
    },
  },
  mounted() {
    let setWindowWidth = Math.floor(
      window.innerWidth - (window.innerWidth * 4) / 10
    ).toString();

    setWindowWidth =
      setWindowWidth.slice(0, setWindowWidth.length <= 3 ? 1 : 2) +
      setWindowWidth
        .slice(setWindowWidth.length <= 3 ? 1 : 2)
        .replace(/\d/g, "0") +
      "px";

    this.$refs.root.style.width = setWindowWidth;
    this.$refs.root.style.height = `${parseFloat(setWindowWidth) / 2}px`;
    this.size = parseFloat(setWindowWidth) / this.width;

    this.components = this.components.map((cur) => {
      return {
        ...cur,
        w: cur.width * this.size,
        h: cur.height * this.size,
        left: cur.x * this.size,
        top: cur.y * this.size,
      };
    });
  },
});
