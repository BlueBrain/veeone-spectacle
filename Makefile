build-latest:
	docker build -t docker-registry-default.ocp.bbp.epfl.ch/bbp-ou-visualization/veeone-spectacle:latest .

push-latest:
	docker login docker-registry-default.ocp.bbp.epfl.ch
	docker push docker-registry-default.ocp.bbp.epfl.ch/bbp-ou-visualization/veeone-spectacle:latest
