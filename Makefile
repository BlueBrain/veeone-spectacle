build-latest-ocp:
	docker build -t docker-registry-default.ocp.bbp.epfl.ch/bbp-ou-visualization/veeone-spectacle:latest .

push-latest-ocp:
	docker login docker-registry-default.ocp.bbp.epfl.ch
	docker push docker-registry-default.ocp.bbp.epfl.ch/bbp-ou-visualization/veeone-spectacle:latest

build-base-image:
	docker login bbpgitlab.epfl.ch:5050
	docker build -t bbpgitlab.epfl.ch:5050/viz/veeone/spectacle/base:latest -f ./spectacle-base.dockerfile .

push-base-image:
	docker login bbpgitlab.epfl.ch:5050
	docker push bbpgitlab.epfl.ch:5050/viz/veeone/spectacle/base:latest
