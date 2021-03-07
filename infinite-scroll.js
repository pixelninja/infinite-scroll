const infiniteScroll = (container) => {
	if (!container) return false;

	const children = container.querySelectorAll(':scope > *');
	let observer = false;
	let height = 0;

	children.forEach(el => {
		height += (el.offsetHeight + parseInt(window.getComputedStyle(el).marginTop) + parseInt(window.getComputedStyle(el).marginBottom));
	});

	// Ratio for calculating how many clones we need to add
	let clone_ratio = Math.ceil(WINDOW.height() / height);

	let addClones = (init = false) => {
		// Wrapper element for each clone block
		const template = $('<div class="infinite__scroll-clone" />');

		// Add any classes we want to specify from data-classes attr on container
		if (container.dataset.classes !== undefined) template.addClass(container.dataset.classes);
		// Wrap the original elements in a container
		if (init) $(children).wrapAll(template);

		// Clone them and add them.
		for (let i = 1; i <= clone_ratio; i++) {
			// Clone original elements and 
			const clone = $(children).clone();
			// Wrap the clones
			const clone_wrapper = clone.wrapAll(template).parent();
			// Add to wrapper
			$(container).append(clone_wrapper);

			// If the oberserver has been initiated, add elements to it
			if (!init && !!observer) {
				observer.observe(clone_wrapper.get(0));
			}
		}

		// On initial call, set the observer
		if (init) {
			observer = new IntersectionObserver((entries, observer) => { 
				entries.forEach(entry => {
					if(entry.isIntersecting) {
						if ($(entry.target).index() !== 0 && $(entry.target).index() % clone_ratio === 0) {
							addClones();
						}

						// Gone past it so unobserve it
						observer.unobserve(entry.target);
					}
				});
			}, {rootMargin: "0px 0px 0px 0px"});

			container.querySelectorAll('.infinite__scroll-clone').forEach(clone => observer.observe(clone));
		}
	};

	// Add initial clones
	addClones(true);
};
