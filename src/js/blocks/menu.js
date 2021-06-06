import {gsap} from "gsap"

export function initMenu() {
	const burgerButton = document.querySelector(".js--burger");
	const menu = document.querySelector(".menu");
	const menuNavItem = document.querySelectorAll(".nav__item_link span");
	const burgerButtonCross = document.querySelector(".js--burger-cross");

	const timeline = gsap.timeline({
		paused: true,
		reversed: true
	})

	timeline
		.to(menu, {
			left: 0,
			duration: 0.7,
		})
		.fromTo(menuNavItem, {
			x: -70,
			opacity: 0
		}, {
			x: 0,
			opacity: 1,
			duration: 0.7,
		}, "-=0.2")
		.fromTo(burgerButtonCross, {
			opacity: 0
		}, {
			opacity: 1,
		}, "-=0.6")

	burgerButton.addEventListener("click", function(){
		timeline.play();
	})

	burgerButtonCross.addEventListener("click", function(){
		timeline.reverse();
	})
}
